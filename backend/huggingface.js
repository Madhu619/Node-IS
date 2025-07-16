import axios from "axios";

export async function getHuggingFaceResponse(userMessage) {
  const apiKey =
    process.env.HUGGING_FACE_API_KEY_GPT2 || process.env.HUGGING_FACE_API_KEY;
  if (!apiKey) throw new Error("Missing Hugging Face API key");
  const model = "gpt2";
  const endpoint = `https://api-inference.huggingface.co/models/${model}`;
  const payload = {
    inputs: userMessage,
    parameters: {
      max_new_tokens: 150,
      temperature: 0.7,
    },
  };
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  try {
    const response = await axios.post(endpoint, payload, { headers });
    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      return response.data[0].generated_text.trim();
    }
    if (response.data?.generated_text) {
      return response.data.generated_text.trim();
    }
    return "Sorry, I couldn't process your request.";
  } catch (err) {
    console.error(
      "Hugging Face API error:",
      err?.response?.data || err.message
    );
    if (err?.response?.data?.error) {
      return `Hugging Face error: ${err.response.data.error}`;
    }
    return "Sorry, I couldn't process your request.";
  }
}
