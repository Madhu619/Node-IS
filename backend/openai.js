import axios from "axios";

export async function getAIResponse(userMessage) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OpenAI API key");
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const payload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: userMessage }],
    max_tokens: 150,
    temperature: 0.7,
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  try {
    const response = await axios.post(endpoint, payload, { headers });
    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("OpenAI API error:", err?.response?.data || err.message);
    if (err?.response?.data?.error?.message) {
      return `OpenAI error: ${err.response.data.error.message}`;
    }
    return "Sorry, I couldn't process your request.";
  }
}
