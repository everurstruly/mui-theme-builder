export default function normalizeTitle(title?: string | null) {
  if (!title) return "";
  return String(title).trim().toLowerCase();
}
