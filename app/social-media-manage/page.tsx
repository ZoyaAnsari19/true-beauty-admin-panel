"use client";

import React, { useState } from "react";
import {
  Share2,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  MessageCircle,
  Pencil,
  Check,
  X,
  Save,
  ArrowUpRight,
} from "lucide-react";

type SocialPlatformId =
  | "facebook"
  | "instagram"
  | "youtube"
  | "twitter"
  | "linkedin"
  | "whatsapp";

type SocialLink = {
  id: SocialPlatformId;
  name: string;
  url: string;
  enabled: boolean;
  editing?: boolean;
};

const INITIAL_SOCIAL_LINKS: SocialLink[] = [
  { id: "facebook", name: "Facebook", url: "", enabled: false },
  { id: "instagram", name: "Instagram", url: "", enabled: false },
  { id: "youtube", name: "YouTube", url: "", enabled: false },
  { id: "twitter", name: "Twitter", url: "", enabled: false },
  { id: "linkedin", name: "LinkedIn", url: "", enabled: false },
  { id: "whatsapp", name: "WhatsApp", url: "", enabled: false },
];

const PLATFORM_ICONS: Record<SocialPlatformId, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
};

export default function SocialMediaManagePage() {
  const [links, setLinks] = useState<SocialLink[]>(INITIAL_SOCIAL_LINKS);
  const [shareOnProducts, setShareOnProducts] = useState(true);
  const [shareOnServices, setShareOnServices] = useState(true);
  const [whatsAppEnabled, setWhatsAppEnabled] = useState(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [whatsAppWelcomeMessage, setWhatsAppWelcomeMessage] = useState("");
  const [socialLoginGoogle, setSocialLoginGoogle] = useState(false);
  const [socialLoginFacebook, setSocialLoginFacebook] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateLink = (id: SocialPlatformId, updates: Partial<SocialLink>) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    );
  };

  const toggleLink = (id: SocialPlatformId) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)),
    );
  };

  const startEdit = (id: SocialPlatformId) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, editing: true } : { ...l, editing: false })),
    );
  };

  const saveEdit = (id: SocialPlatformId) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, editing: false } : l)),
    );
  };

  const cancelEdit = (id: SocialPlatformId) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, editing: false } : l)),
    );
  };

  const handleSaveAll = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Social Media Manage</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage social links, share buttons, WhatsApp chat & social login
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D96A86] text-white font-medium hover:bg-[#C85A76] transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved" : "Save changes"}
        </button>
      </div>

      {/* Social media links */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Social media links</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Add URLs and enable platforms to show on your website
          </p>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            {links.map((link) => {
              const Icon = PLATFORM_ICONS[link.id];
              return (
                <li
                  key={link.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-gray-50/60 border border-gray-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 shrink-0">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">{link.name}</span>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3">
                    {link.editing ? (
                      <>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateLink(link.id, { url: e.target.value })}
                          placeholder={`https://${link.id}.com/...`}
                          className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#D96A86]/30 focus:border-[#D96A86] outline-none"
                        />
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => saveEdit(link.id)}
                            className="p-2 rounded-lg bg-[#D96A86] text-white hover:bg-[#C85A76] transition-colors"
                            aria-label="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => cancelEdit(link.id)}
                            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                            aria-label="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          {link.url ? (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#D96A86] hover:underline truncate inline-flex items-center gap-1"
                            >
                              {link.url}
                              <ArrowUpRight className="w-4 h-4 shrink-0 text-gray-400" />
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">No URL added</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => startEdit(link.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                  <label className="flex items-center gap-2 shrink-0 cursor-pointer">
                    <span className="text-sm text-gray-600">Status</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={link.enabled}
                      onClick={() => toggleLink(link.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30 ${
                        link.enabled ? "bg-[#D96A86] border-[#D96A86]" : "bg-gray-200 border-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                          link.enabled ? "translate-x-5" : "translate-x-0.5"
                        }`}
                        style={{ marginTop: 2 }}
                      />
                    </button>
                    <span className="text-sm text-gray-500">{link.enabled ? "On" : "Off"}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Social share buttons */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-gray-600" />
            Social share buttons
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Show share buttons on product and service pages
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/60 border border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Product pages</p>
              <p className="text-sm text-gray-500">Allow visitors to share products on social media</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={shareOnProducts}
              onClick={() => setShareOnProducts((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30 ${
                shareOnProducts ? "bg-[#D96A86] border-[#D96A86]" : "bg-gray-200 border-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                  shareOnProducts ? "translate-x-5" : "translate-x-0.5"
                }`}
                style={{ marginTop: 2 }}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/60 border border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Service pages</p>
              <p className="text-sm text-gray-500">Allow visitors to share services on social media</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={shareOnServices}
              onClick={() => setShareOnServices((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30 ${
                shareOnServices ? "bg-[#D96A86] border-[#D96A86]" : "bg-gray-200 border-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                  shareOnServices ? "translate-x-5" : "translate-x-0.5"
                }`}
                style={{ marginTop: 2 }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp chat integration */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-gray-600" />
            WhatsApp chat integration
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Enable floating WhatsApp button and set your business number
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/60 border border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Enable WhatsApp chat</p>
              <p className="text-sm text-gray-500">Show WhatsApp button on website</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={whatsAppEnabled}
              onClick={() => setWhatsAppEnabled((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30 ${
                whatsAppEnabled ? "bg-[#D96A86] border-[#D96A86]" : "bg-gray-200 border-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                  whatsAppEnabled ? "translate-x-5" : "translate-x-0.5"
                }`}
                style={{ marginTop: 2 }}
              />
            </button>
          </div>
          {whatsAppEnabled && (
            <div className="space-y-4 p-4 rounded-xl bg-gray-50/60 border border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  WhatsApp number
                </label>
                <input
                  type="tel"
                  value={whatsAppNumber}
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#D96A86]/30 focus:border-[#D96A86] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Welcome message (optional)
                </label>
                <textarea
                  value={whatsAppWelcomeMessage}
                  onChange={(e) => setWhatsAppWelcomeMessage(e.target.value)}
                  placeholder="Pre-filled message when user clicks chat"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#D96A86]/30 focus:border-[#D96A86] outline-none resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Social login settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Social login</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Allow users to sign in with Google or Facebook (optional)
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/60 border border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Google login</p>
              <p className="text-sm text-gray-500">Sign in with Google account</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={socialLoginGoogle}
              onClick={() => setSocialLoginGoogle((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30 ${
                socialLoginGoogle ? "bg-[#D96A86] border-[#D96A86]" : "bg-gray-200 border-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                  socialLoginGoogle ? "translate-x-5" : "translate-x-0.5"
                }`}
                style={{ marginTop: 2 }}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/60 border border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Facebook login</p>
              <p className="text-sm text-gray-500">Sign in with Facebook account</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={socialLoginFacebook}
              onClick={() => setSocialLoginFacebook((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30 ${
                socialLoginFacebook ? "bg-[#D96A86] border-[#D96A86]" : "bg-gray-200 border-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                  socialLoginFacebook ? "translate-x-5" : "translate-x-0.5"
                }`}
                style={{ marginTop: 2 }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
