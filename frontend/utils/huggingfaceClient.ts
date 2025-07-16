// This function is now repurposed to call your backend OpenAI endpoint for AI chat responses.
// The backend should handle the OpenAI API securely; this client just calls your backend API.
export async function getOpenAIResponseClient(prompt: string): Promise<string> {
  try {
    const response = await fetch("/api/ai/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (data && data.response) {
      return data.response.trim();
    }
    return "Sorry, I couldn't process your request.";
  } catch (error) {
    return "Sorry, there was an error contacting the AI service.";
  }
}
