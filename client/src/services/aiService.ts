export function isApiKeyConfigured(): boolean {
  return import.meta.env.VITE_OPENAI_API_KEY !== undefined;
}
