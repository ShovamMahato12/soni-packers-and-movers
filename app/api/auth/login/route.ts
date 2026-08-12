import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
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

async function authenticateEnvAdmin(loginId: string, password: string) {
  // Case-insensitive comparison for loginId
  if (loginId.toLowerCase() !== ENV_ADMIN_LOGIN_ID.toLowerCase() || password !== ENV_ADMIN_PASSWORD) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(ENV_ADMIN_PASSWORD, 12);

  const admin = await prisma.admin.upsert({
    where: { loginId: ENV_ADMIN_LOGIN_ID },
    update: { password: hashedPassword },
    create: { loginId: ENV_ADMIN_LOGIN_ID, password: hashedPassword },
  });

  return admin;
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

    let admin = await prisma.admin.findUnique({
      where: { loginId },
    });

    if (!admin) {
      admin = await authenticateEnvAdmin(loginId, password);
      if (!admin) {
        return jsonError("Invalid login ID or password", 401);
      }
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      if (loginId.toLowerCase() === ENV_ADMIN_LOGIN_ID.toLowerCase() && password === ENV_ADMIN_PASSWORD) {
        admin = await authenticateEnvAdmin(loginId, password);
      } else {
        return jsonError("Invalid login ID or password", 401);
      }
    }

    if (!admin) {
      return jsonError("Invalid login ID or password", 401);
    }

    await setSessionCookie({ adminId: admin.id, loginId: admin.loginId });

    const response = jsonSuccess({ loginId: admin.loginId });
    return applyNoStoreHeaders(response);
  } catch {
    return jsonError("Login failed", 500);
  }
}
