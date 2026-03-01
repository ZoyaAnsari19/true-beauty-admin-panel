"use client";

import React, { useState, useCallback } from "react";
import {
  Image as ImageIcon,
  Palette,
  Layout,
  ImagePlus,
  Store,
  Save,
  RotateCcw,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  type LucideIcon,
} from "lucide-react";

/* Predefined theme CSS variables (for reference and preset application) */
const THEME_PRESETS = [
  {
    id: "royal-blue",
    name: "Royal Blue",
    class: "theme-royal-blue",
    primary: "#2563EB",
    secondary: "#EFF6FF",
    accent: "#1E40AF",
  },
  {
    id: "emerald-green",
    name: "Emerald Green",
    class: "theme-emerald-green",
    primary: "#059669",
    secondary: "#ECFDF5",
    accent: "#047857",
  },
  {
    id: "purple-glow",
    name: "Purple Glow",
    class: "theme-purple-glow",
    primary: "#7C3AED",
    secondary: "#F5F3FF",
    accent: "#5B21B6",
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    class: "theme-sunset-orange",
    primary: "#F97316",
    secondary: "#FFF7ED",
    accent: "#EA580C",
  },
  {
    id: "teal-ocean",
    name: "Teal Ocean",
    class: "theme-teal-ocean",
    primary: "#0D9488",
    secondary: "#F0FDFA",
    accent: "#0F766E",
  },
  {
    id: "hot-pink",
    name: "Hot Pink",
    class: "theme-hot-pink",
    primary: "#EC4899",
    secondary: "#FDF2F8",
    accent: "#DB2777",
  },
  {
    id: "coffee-brown",
    name: "Coffee Brown",
    class: "theme-coffee-brown",
    primary: "#92400E",
    secondary: "#FEF3C7",
    accent: "#78350F",
  },
  {
    id: "dark-mode-pro",
    name: "Dark Mode Pro",
    class: "theme-dark-mode-pro",
    primary: "#0F172A",
    secondary: "#1E293B",
    accent: "#38BDF8",
  },
  {
    id: "mint-fresh",
    name: "Mint Fresh",
    class: "theme-mint-fresh",
    primary: "#22C55E",
    secondary: "#F0FDF4",
    accent: "#16A34A",
  },
  {
    id: "soft-lavender",
    name: "Soft Lavender",
    class: "theme-soft-lavender",
    primary: "#A78BFA",
    secondary: "#F5F3FF",
    accent: "#7C3AED",
  },
] as const;

const SOCIAL_ICONS: { key: string; label: string; icon: LucideIcon }[] = [
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "twitter", label: "Twitter", icon: Twitter },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "youtube", label: "YouTube", icon: Youtube },
];

const DEFAULT_THEME = {
  primary: "#2563EB",
  secondary: "#EFF6FF",
  accent: "#1E40AF",
  button: "#2563EB",
  background: "#FFFFFF",
};

export default function WebThemePage() {
  const [brandName, setBrandName] = useState("True Beauty");
  const [footerText, setFooterText] = useState("© 2025 True Beauty. All rights reserved.");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
  });

  const [primaryColor, setPrimaryColor] = useState(DEFAULT_THEME.primary);
  const [secondaryColor, setSecondaryColor] = useState(DEFAULT_THEME.secondary);
  const [accentColor, setAccentColor] = useState(DEFAULT_THEME.accent);
  const [buttonColor, setButtonColor] = useState(DEFAULT_THEME.button);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_THEME.background);

  const [heroBanner, setHeroBanner] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState(true);
  const [services, setServices] = useState(true);
  const [testimonials, setTestimonials] = useState(true);
  const [affiliateSection, setAffiliateSection] = useState(true);

  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerTitle, setBannerTitle] = useState("Welcome to True Beauty");
  const [bannerDescription, setBannerDescription] = useState("Discover premium beauty products and services.");
  const [bannerCta, setBannerCta] = useState("Shop Now");

  const [sellerThemeOverride, setSellerThemeOverride] = useState(false);

  const handleLogoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleFaviconChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFaviconFile(file);
      setFaviconPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleBannerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  }, []);

  const applyPreset = (preset: (typeof THEME_PRESETS)[number]) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setAccentColor(preset.accent);
    setButtonColor(preset.primary);
    setBackgroundColor(preset.secondary);
  };

  const resetToDefault = () => {
    setPrimaryColor(DEFAULT_THEME.primary);
    setSecondaryColor(DEFAULT_THEME.secondary);
    setAccentColor(DEFAULT_THEME.accent);
    setButtonColor(DEFAULT_THEME.button);
    setBackgroundColor(DEFAULT_THEME.background);
    setBrandName("True Beauty");
    setFooterText("© 2025 True Beauty. All rights reserved.");
    setBannerTitle("Welcome to True Beauty");
    setBannerDescription("Discover premium beauty products and services.");
    setBannerCta("Shop Now");
    setSocialLinks({ facebook: "", instagram: "", twitter: "", linkedin: "", youtube: "" });
    setHeroBanner(true);
    setFeaturedProducts(true);
    setServices(true);
    setTestimonials(true);
    setAffiliateSection(true);
    setSellerThemeOverride(false);
    setLogoFile(null);
    setLogoPreview(null);
    setFaviconFile(null);
    setFaviconPreview(null);
    setBannerImage(null);
    setBannerPreview(null);
  };

  const handleSave = () => {
    // In a real app: persist to API / localStorage
    console.log("Save theme", {
      brandName,
      footerText,
      primaryColor,
      secondaryColor,
      accentColor,
      buttonColor,
      backgroundColor,
      layout: { heroBanner, featuredProducts, services, testimonials, affiliateSection },
      banner: { bannerTitle, bannerDescription, bannerCta },
      sellerThemeOverride,
    });
    alert("Theme settings saved successfully.");
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Web Theme</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetToDefault}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to default
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#D96A86] text-white text-sm font-medium hover:bg-[#C85A76] transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column: forms */}
        <div className="xl:col-span-2 space-y-6">
          {/* Branding */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-500" />
              <h2 className="text-base font-semibold text-gray-900">Branding</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Logo</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#D96A86] hover:bg-[#fef5f7] transition-colors overflow-hidden">
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </label>
                    <span className="text-xs text-gray-500">PNG, JPG. Click to upload.</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Favicon</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-shrink-0 w-12 h-12 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#D96A86] hover:bg-[#fef5f7] transition-colors overflow-hidden">
                      <input type="file" accept="image/*,.ico" className="hidden" onChange={handleFaviconChange} />
                      {faviconPreview ? (
                        <img src={faviconPreview} alt="Favicon" className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </label>
                    <span className="text-xs text-gray-500">ICO, PNG. 32×32 recommended.</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30 focus:border-[#D96A86]"
                  placeholder="Your brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
                <textarea
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30 focus:border-[#D96A86] resize-none"
                  placeholder="Footer copyright or message"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Social Links</label>
                <div className="space-y-3">
                  {SOCIAL_ICONS.map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                      <input
                        type="url"
                        value={socialLinks[key] ?? ""}
                        onChange={(e) => setSocialLinks((s) => ({ ...s, [key]: e.target.value }))}
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30 focus:border-[#D96A86]"
                        placeholder={`${label} URL`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Color Theme */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Palette className="w-5 h-5 text-gray-500" />
              <h2 className="text-base font-semibold text-gray-900">Color Theme</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Preset themes</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="flex flex-col rounded-xl border-2 border-gray-200 overflow-hidden hover:border-[#D96A86] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30"
                    >
                      <div className="flex h-10">
                        <span className="flex-1" style={{ backgroundColor: preset.primary }} />
                        <span className="flex-1" style={{ backgroundColor: preset.secondary }} />
                        <span className="flex-1" style={{ backgroundColor: preset.accent }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 py-1.5 px-2 truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Homepage Layout Toggles */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Layout className="w-5 h-5 text-gray-500" />
              <h2 className="text-base font-semibold text-gray-900">Homepage Layout</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { state: heroBanner, set: setHeroBanner, label: "Hero Banner" },
                  { state: featuredProducts, set: setFeaturedProducts, label: "Featured Products" },
                  { state: services, set: setServices, label: "Services" },
                  { state: testimonials, set: setTestimonials, label: "Testimonials" },
                  { state: affiliateSection, set: setAffiliateSection, label: "Affiliate Section" },
                ].map(({ state, set, label }) => (
                  <div key={label} className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={state}
                      onClick={() => set(!state)}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30 ${
                        state ? "bg-[#D96A86] border-[#D96A86]" : "bg-gray-200 border-gray-200"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                          state ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Banner Management */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <ImagePlus className="w-5 h-5 text-gray-500" />
              <h2 className="text-base font-semibold text-gray-900">Banner Management</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Banner</label>
                <label className="block w-full aspect-[3/1] max-h-40 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#D96A86] hover:bg-[#fef5f7] transition-colors overflow-hidden bg-gray-50">
                  <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm text-gray-500">Click to upload banner image</span>
                  )}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30 focus:border-[#D96A86]"
                  placeholder="Banner title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={bannerDescription}
                  onChange={(e) => setBannerDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30 focus:border-[#D96A86] resize-none"
                  placeholder="Banner description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                <input
                  type="text"
                  value={bannerCta}
                  onChange={(e) => setBannerCta(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30 focus:border-[#D96A86]"
                  placeholder="e.g. Shop Now"
                />
              </div>
            </div>
          </section>

          {/* Seller Theme Override */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Store className="w-5 h-5 text-gray-500" />
              <h2 className="text-base font-semibold text-gray-900">Seller Theme Override</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Allow seller custom themes</p>
                  <p className="text-xs text-gray-500 mt-0.5">Let sellers apply their own theme on storefronts.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={sellerThemeOverride}
                  onClick={() => setSellerThemeOverride(!sellerThemeOverride)}
                  className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[#D96A86]/30 ${
                    sellerThemeOverride ? "bg-[#D96A86] border-[#D96A86]" : "bg-gray-200 border-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                      sellerThemeOverride ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right column: Live preview */}
        <div className="xl:col-span-1">
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Live Preview</h2>
            </div>
            <div
              className="p-6 min-h-[320px] rounded-b-2xl transition-colors"
              style={{ backgroundColor }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {logoPreview ? (
                    <img src={logoPreview} alt="" className="h-8 w-auto object-contain" />
                  ) : (
                    <div
                      className="h-8 w-20 rounded flex items-center justify-center text-white text-xs font-semibold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {brandName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-semibold truncate" style={{ color: primaryColor }}>
                    {brandName || "Brand"}
                  </span>
                </div>
                <div
                  className="rounded-xl p-4 border"
                  style={{ borderColor: secondaryColor, backgroundColor: secondaryColor }}
                >
                  <p className="text-sm font-medium mb-2" style={{ color: accentColor }}>
                    {bannerTitle || "Banner Title"}
                  </p>
                  <p className="text-xs opacity-80 mb-3" style={{ color: accentColor }}>
                    {bannerDescription || "Banner description."}
                  </p>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg text-white text-xs font-medium"
                    style={{ backgroundColor: buttonColor }}
                  >
                    {bannerCta || "CTA"}
                  </button>
                </div>
                <div className="flex gap-2">
                  <div
                    className="flex-1 h-16 rounded-lg"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div
                    className="flex-1 h-16 rounded-lg"
                    style={{ backgroundColor: secondaryColor }}
                  />
                  <div
                    className="flex-1 h-16 rounded-lg"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>
                <p className="text-xs text-gray-500">Primary · Secondary · Accent</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
