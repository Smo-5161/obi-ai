export const config = {
  get mistralApiKey(): string | undefined {
    return process.env.MISTRAL_API_KEY || undefined;
  },
  mistralModel: process.env.OMI_MODEL || "mistral-medium-latest",
  transcriptModel: process.env.OMI_TRANSCRIBE_MODEL || "mistral-small-latest",
  topK: Number(process.env.OMI_TOP_K || 5),
};
