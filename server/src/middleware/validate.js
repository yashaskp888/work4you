const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+\-().]{7,20}$/;

export function sanitizeString(value, maxLen = 500) {
  if (value == null) return '';
  return String(value)
    .trim()
    .slice(0, maxLen)
    .replace(/<[^>]*>/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

export function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function sanitizeOrganization(org) {
  if (!org || typeof org !== 'object') return null;

  const name = sanitizeString(org.name, 120);
  const businessType = sanitizeString(org.businessType, 80);
  const industry = sanitizeString(org.industry, 80);
  const ownerName = sanitizeString(org.ownerName, 120);
  const email = sanitizeString(org.email, 254).toLowerCase();
  const mobile = sanitizeString(org.mobile, 20);
  const city = sanitizeString(org.city, 80);
  const country = sanitizeString(org.country, 80);

  if (!name || !businessType || !industry || !ownerName || !email || !mobile || !city || !country) {
    return null;
  }
  if (!EMAIL_RE.test(email) || !PHONE_RE.test(mobile)) return null;

  return {
    name,
    businessType,
    industry,
    ownerName,
    email,
    mobile,
    whatsapp: sanitizeString(org.whatsapp, 20) || undefined,
    address: sanitizeString(org.address, 300) || undefined,
    city,
    state: sanitizeString(org.state, 80) || undefined,
    country,
  };
}

export function sanitizeRequirements(req) {
  if (!req || typeof req !== 'object') return null;

  const websiteCategory = sanitizeString(req.websiteCategory, 80);
  const purpose = sanitizeString(req.purpose, 500);
  const numberOfPages = sanitizeString(req.numberOfPages, 40);
  const budget = sanitizeString(req.budget, 40);

  if (!websiteCategory || !purpose || !numberOfPages || !budget) return null;

  const features = Array.isArray(req.features)
    ? req.features.map((f) => sanitizeString(f, 80)).filter(Boolean).slice(0, 30)
    : [];

  return {
    websiteCategory,
    purpose,
    numberOfPages,
    features,
    designPreferences: sanitizeString(req.designPreferences, 500) || undefined,
    referenceWebsites: [],
    domainRequired: Boolean(req.domainRequired),
    hostingRequired: req.hostingRequired !== false,
    seoRequired: Boolean(req.seoRequired),
    budget,
    deadline: sanitizeString(req.deadline, 80) || undefined,
    additionalNotes: sanitizeString(req.additionalNotes, 2000) || undefined,
  };
}
