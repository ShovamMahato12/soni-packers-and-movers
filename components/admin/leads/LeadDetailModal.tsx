"use client";

import { useEffect, useState, useRef } from "react";
import { X, Mail, FileText, Send, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import StatusBadge from "@/components/admin/shared/StatusBadge";
import { formatDateTime } from "@/lib/lead-crm";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  movingFrom: string;
  movingTo: string;
  moveDate: string;
  moveType: string;
  message: string;
  status: string;
  createdAt: string;
  nextFollowUpAt?: string | null;
  adminNote?: string | null;
  statusUpdatedAt?: string | null;
};

type Email = {
  id: string;
  direction: "SENT" | "RECEIVED";
  subject: string;
  body: string;
  from: string;
  to: string;
  createdAt: string;
};

export default function LeadDetailModal({
  lead,
  onClose,
}: {
  lead: Lead;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"details" | "emails">("details");
  const [emails, setEmails] = useState<Email[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [subject, setSubject] = useState(`Re: Shifting inquiry - Sony Packers and Movers`);
  const [body, setBody] = useState("");
  const conversationEndRef = useRef<HTMLDivElement>(null);

  const fetchEmails = async (silent = false) => {
    if (!silent) setLoadingEmails(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}/emails`);
      const data = await res.json();
      if (res.ok && data.success) {
        setEmails(data.emails);
      } else {
        toast.error(data.message ?? "Failed to sync emails");
      }
    } catch {
      toast.error("An error occurred while syncing emails");
    } finally {
      if (!silent) setLoadingEmails(false);
    }
  };

  useEffect(() => {
    if (activeTab === "emails") {
      void fetchEmails();
    }
  }, [activeTab]);

  // Scroll to bottom of email thread when emails are updated
  useEffect(() => {
    if (activeTab === "emails" && emails.length > 0) {
      conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [emails, activeTab]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setSendingEmail(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}/emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Email sent successfully!");
        setBody(""); // clear message input
        void fetchEmails(true); // reload list silently
      } else {
        toast.error(data.message ?? "Failed to send email");
      }
    } catch {
      toast.error("Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Lead: {lead.name}</h2>
            <p className="text-xs text-slate-500">{lead.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-5">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-semibold transition-all ${
              activeTab === "details"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText size={16} />
            Lead Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("emails")}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-semibold transition-all ${
              activeTab === "emails"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Mail size={16} />
            Email Center
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "details" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={lead.status} />
                <span className="text-xs text-slate-500">Submitted {formatDateTime(lead.createdAt)}</span>
              </div>
              <dl className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Name", lead.name],
                  ["Phone", lead.phone],
                  ["Email", lead.email],
                  ["Move Type", lead.moveType],
                  ["Moving From", lead.movingFrom],
                  ["Moving To", lead.movingTo],
                  ["Move Date", formatDateTime(lead.moveDate)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-slate-50 p-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Message</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{lead.message}</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Follow-up Details</h3>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current Status</dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">
                      <StatusBadge status={lead.status} />
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next Follow-up</dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">{formatDateTime(lead.nextFollowUpAt)}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last Updated</dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900">{formatDateTime(lead.statusUpdatedAt)}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full Admin Note</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{lead.adminNote?.trim() || "-"}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full space-y-4">
              {/* Email Control Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs text-slate-500">
                  Replies are synced automatically from <strong className="text-slate-700">{process.env.SMTP_USER || "Gmail"}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => void fetchEmails()}
                  disabled={loadingEmails}
                  className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 disabled:opacity-40"
                >
                  <RefreshCw size={12} className={loadingEmails ? "animate-spin" : ""} />
                  Sync Replies
                </button>
              </div>

              {/* Email Thread Area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[250px] max-h-[350px] bg-slate-50/70 rounded-xl p-4 border border-slate-100">
                {loadingEmails ? (
                  <div className="flex h-full flex-col items-center justify-center py-10 text-slate-400">
                    <RefreshCw className="animate-spin text-orange-500 mb-2" size={24} />
                    <p className="text-sm">Connecting & syncing Gmail inbox...</p>
                  </div>
                ) : emails.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center py-10 text-center text-slate-400">
                    <Mail size={32} className="text-slate-300 mb-2" />
                    <p className="text-sm font-semibold">No email correspondence yet.</p>
                    <p className="text-xs mt-1">Send a message below to start the conversation.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emails.map((email) => {
                      const isSent = email.direction === "SENT";
                      return (
                        <div
                          key={email.id}
                          className={`flex flex-col ${isSent ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                              isSent
                                ? "bg-orange-600 text-white rounded-tr-none"
                                : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                            }`}
                          >
                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                              isSent ? "text-orange-200" : "text-slate-400"
                            }`}>
                              Subject: {email.subject}
                            </p>
                            <p className="text-sm whitespace-pre-wrap leading-relaxed break-words">
                              {email.body}
                            </p>
                            <p className={`text-[9px] mt-2 text-right ${
                              isSent ? "text-orange-100" : "text-slate-400"
                            }`}>
                              {formatDateTime(email.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={conversationEndRef} />
                  </div>
                )}
              </div>

              {/* Email Sender Form */}
              <form onSubmit={handleSendEmail} className="space-y-3 pt-3 border-t border-slate-100">
                <div>
                  <label htmlFor="email-subject" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Subject
                  </label>
                  <input
                    id="email-subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
                    placeholder="Subject line"
                  />
                </div>
                <div>
                  <label htmlFor="email-body" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Reply Message
                  </label>
                  <textarea
                    id="email-body"
                    required
                    rows={4}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="Type your email body here..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sendingEmail || !body.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {sendingEmail ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Send Email
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
