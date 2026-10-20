export const config = {
  get mistralApiKey(): string | undefined {
    return process.env.MISTRAL_API_KEY || undefined;
  },
  mistralModel: process.env.OBI_MODEL || "mistral-medium-latest",
  transcriptModel: process.env.OBI_TRANSCRIBE_MODEL || "mistral-small-latest",
  topK: Number(process.env.OBI_TOP_K || 5),
};
