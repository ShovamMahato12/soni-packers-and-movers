import bcrypt from "bcryptjs";
import { z } from "zod";

import { applyNoStoreHeaders, setSessionCookie } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  loginId: z.string().min(1),
  password: z.string().min(1),
});

const ENV_ADMIN_LOGIN_ID = process.env.ADMIN_LOGIN_ID?.trim() ?? "Admin";
const ENV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin123";
const ENV_ADMIN_ID = "environment-admin";

async function authenticateEnvAdmin(loginId: string, password: string) {
  if (loginId.toLowerCase() !== ENV_ADMIN_LOGIN_ID.toLowerCase() || password !== ENV_ADMIN_PASSWORD) {
    return null;
  }

  return { id: ENV_ADMIN_ID, loginId: ENV_ADMIN_LOGIN_ID };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError("Invalid credentials", 400);
    }

    const loginId = parsed.data.loginId.trim();
    const password = parsed.data.password;

    // First, check if credentials match environment variables
    if (loginId.toLowerCase() === ENV_ADMIN_LOGIN_ID.toLowerCase() && password === ENV_ADMIN_PASSWORD) {
      const admin = await authenticateEnvAdmin(loginId, password);
      if (admin) {
        await setSessionCookie({ adminId: admin.id, loginId: admin.loginId });
        const response = jsonSuccess({ loginId: admin.loginId });
        return applyNoStoreHeaders(response);
      }
    }

    // If not env credentials, try to find in database with case-insensitive lookup
    const admins = await prisma.admin.findMany({
      where: {
        loginId: {
          equals: loginId,
          mode: "insensitive",
        },
      },
    });

    const admin = admins.length > 0 ? admins[0] : null;

    if (!admin) {
      return jsonError("Invalid login ID or password", 401);
    }

    // Verify password against database record
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return jsonError("Invalid login ID or password", 401);
    }

    await setSessionCookie({ adminId: admin.id, loginId: admin.loginId });
    const response = jsonSuccess({ loginId: admin.loginId });
    return applyNoStoreHeaders(response);
  } catch (error) {
    console.error("Login error:", error);
    return jsonError("Login failed", 500);
  }
}
