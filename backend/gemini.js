import axios from "axios";

export async function getGeminiResponse(userMessage) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Missing Google Gemini API key");
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;
  const payload = {
    contents: [
      {
        parts: [{ text: userMessage }],
      },
    ],
  };
  try {
    const response = await axios.post(endpoint, payload);
    // Gemini returns response.data.candidates[0].content.parts[0].text
    return (
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Sorry, I couldn't process your request."
    );
  } catch (err) {
    console.error("Gemini API error:", err?.response?.data || err.message);
    if (err?.response?.data?.error?.message) {
      return `Gemini error: ${err.response.data.error.message}`;
    }
    return "Sorry, I couldn't process your request.";
  }
}
