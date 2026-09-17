// features/email-inbox/api/mapEmail.js
// Maps one record from the real GET /emails response into the shape
// EmailList / EmailListItem / EmailDetail expect (previously supplied by
// the MOCK_EMAILS fixtures in emailsData.js).
//
// Fields the API does NOT return, that the UI needs, are derived here:
//   - initials / color   -> derived from the sender's name
//   - preview             -> derived from body_plain
//   - time / fullTime     -> derived from received_at (which can be null)
// Fields the API does NOT return, with no way to derive them, default to
// a safe value and are called out below:
//   - unread  -> the API sends no read/unread flag in this response, so
//                every email is treated as unread until the backend adds
//                one (see note on markEmailRead in emailApi.js).
//   - tag/star -> not present in the API; simply omitted (EmailListItem
//                 already renders these conditionally).

const AVATAR_COLORS = ['#2563eb', '#16a34a', '#7c3aed', '#c2410c', '#0d9488', '#db2777', '#1e3a8a', '#6b7280'];

function hashToIndex(str, mod) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % mod;
}

// "Amritpal <amritpal.perfectweb@gmail.com>" -> { name: "Amritpal", email: "amritpal.perfectweb@gmail.com" }
function parseSender(sender) {
  if (!sender) return { name: 'Unknown Sender', email: '' };
  const match = sender.match(/^(.*?)\s*<(.+)>\s*$/);
  if (match) {
    const name = match[1].replace(/^"|"$/g, '').trim();
    return { name: name || match[2], email: match[2].trim() };
  }
  return { name: sender, email: sender };
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function stripHtmlWhitespace(text) {
  return (text || '').replace(/\s+/g, ' ').trim();
}

function makePreview(bodyPlain, maxLen = 70) {
  const clean = stripHtmlWhitespace(bodyPlain);
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, maxLen).trimEnd()}...`;
}

function formatEmailTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatEmailFullTime(isoString) {
  if (!isoString) return 'Unknown time';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return 'Unknown time';
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const datePart = isToday
    ? 'Today'
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${datePart}, ${formatEmailTime(isoString)}`;
}

export function mapApiEmailToUiEmail(raw) {
  const { name, email } = parseSender(raw.sender);
  const initials = getInitials(name);
  const color = AVATAR_COLORS[hashToIndex(raw.id || email || name, AVATAR_COLORS.length)];

  return {
    id: raw.id,
    initials,
    color,
    name,
    email,
    to: raw.recipient || '',
    time: formatEmailTime(raw.received_at),
    fullTime: formatEmailFullTime(raw.received_at),
    subject: raw.subject || '(No subject)',
    fullSubject: raw.subject || '(No subject)',
    preview: makePreview(raw.body_plain),
    bodyHtml: raw.body_html || `<p>${stripHtmlWhitespace(raw.body_plain)}</p>`,
    // No read/unread field in the API response yet — defaults every
    // email to unread. Once the backend adds one, swap this for
    // `raw.unread ?? true` (or whatever field name it uses).
    unread: true,
    tag: undefined,
    star: false,
    signature: null,
    attachments: raw.attachments || [],
  };
}
