const PII_PATTERNS: { name: string; re: RegExp; mask: string }[] = [
  { name: "email", re: /[\w.+-]+@[\w-]+\.[\w.]{2,}/g, mask: "[EMAIL]" },
  { name: "phone", re: /\b(?:\+?\d{1,3}[\s.-]?)?(?:0\d[\s.-]?)?\d{2}(?:[\s.-]?\d{2}){3,4}\b/g, mask: "[PHONE]" },
  { name: "iban", re: /\bFR\d{2}[ ]?\d{4}([ ]?\d{4}){2,5}\b/gi, mask: "[IBAN]" },
  { name: "card", re: /\b(?:\d{4}[ -]?){3}\d{4}\b/g, mask: "[CARD]" },
  { name: "password", re: /\b(?:password|mot de passe|mdp|passwd)\s*[:=]\s*\S+/gi, mask: "[PASSWORD]" },
  { name: "token", re: /\b(?:sk-|api[_-]?key|token|bearer)\s*[:=]?\s*[\w-]{12,}/gi, mask: "[TOKEN]" },
  { name: "ip", re: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, mask: "[IP]" },
];

export interface RedactionResult {
  text: string;
  maskedCount: number;
  found: string[];
}

export function redactPII(text: string): RedactionResult {
  let maskedCount = 0;
  const found: string[] = [];
  let out = text;
  for (const p of PII_PATTERNS) {
    out = out.replace(p.re, () => {
      maskedCount++;
      found.push(p.name);
      return p.mask;
    });
  }
  return { text: out, maskedCount, found };
}

export function maskActionLogs<T extends { text?: string; url?: string }>(logs: T[]): T[] {
  return logs.map((l) => {
    const copy = { ...l };
    if (copy.text) copy.text = redactPII(copy.text).text;
    if (copy.url) copy.url = copy.url.replace(/\/\/[^/]*@/, "//[CREDENTIALS]@");
    return copy;
  });
}
