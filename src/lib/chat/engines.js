const ENGINES = [
  { id: 1, provider: "groq", model: "llama-3.3-70b-versatile", name: "Groq Llama 3.3" },
  { id: 2, provider: "groq", model: "llama-3.1-70b-versatile", name: "Groq Llama 3.1" },
  { id: 3, provider: "groq", model: "mixtral-8x7b-32768", name: "Groq Mixtral" },
  { id: 4, provider: "groq", model: "llama3-70b-8192", name: "Groq Llama 3 (70B)" },
  { id: 5, provider: "groq", model: "llama3-8b-8192", name: "Groq Llama 3 (8B)" },
  { id: 6, provider: "mistral", model: "mistral-large-latest", name: "Mistral Large" },
  { id: 7, provider: "mistral", model: "pixtral-12b-2409", name: "Pixtral 12B" },
  { id: 8, provider: "mistral", model: "mistral-small-latest", name: "Mistral Small" },
  { id: 9, provider: "gemini", model: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
  { id: 10, provider: "gemini", model: "gemini-2.0-flash-lite", name: "Gemini 2.0 Lite" },
  { id: 11, provider: "gemini", model: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
  { id: 12, provider: "gemini", model: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
  { id: 13, provider: "openrouter", model: "meta-llama/llama-3.1-70b-instruct:free", name: "OR Llama 3.1 70B" },
  { id: 14, provider: "openrouter", model: "qwen/qwen-2.5-72b-instruct", name: "OR Qwen 2.5 72B" },
  { id: 15, provider: "openrouter", model: "mistralai/mistral-large", name: "OR Mistral Large" },
  { id: 16, provider: "openrouter", model: "meta-llama/llama-3.1-8b-instruct", name: "OR Llama 3.1 8B" },
  { id: 17, provider: "openrouter", model: "google/gemini-flash-1.5", name: "OR Gemini 1.5 Flash" },
  { id: 18, provider: "openrouter", model: "deepseek/deepseek-chat", name: "OR DeepSeek" },
  { id: 19, provider: "openrouter", model: "cohere/command-r-plus", name: "OR Command R+" },
  { id: 20, provider: "openrouter", model: "mistralai/mixtral-8x7b-instruct:free", name: "OR Mixtral 8x7B" },
];

export default ENGINES;
