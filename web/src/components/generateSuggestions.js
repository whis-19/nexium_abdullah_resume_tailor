export const generateSuggestionsFromJob = async (jobDescription) => {
  // Debug: Check what environment variables are available
  console.log("Available env vars:", Object.keys(process.env));
  console.log(
    "GEMINI_API_KEY:",
    process.env.GEMINI_API_KEY ? "Found" : "Missing"
  );
  console.log(
    "NEXT_PUBLIC_GEMINI_API_KEY:",
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ? "Found" : "Missing"
  );

  const apiKey =
    process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("API Key Debug Info:");
    console.error("- Check if .env.local exists in project root");
    console.error("- Check if server was restarted after adding env var");
    console.error("- Current working directory:", process.cwd());
    throw new Error("Gemini API key is missing.");
  }

  console.log("API Key found, length:", apiKey.length);

  const prompt = `Based on this job description, generate 5-7 impactful resume bullet points. Return ONLY a valid JSON array of strings, no markdown formatting or extra text:\n\n${jobDescription}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "API Response not OK:",
        response.status,
        response.statusText
      );
      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("No content received from Gemini API");
    }

    // Clean the response - remove markdown code blocks if present
    let cleanedText = rawText.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/```json\s*/, "")
        .replace(/```\s*$/, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText
        .replace(/```[a-zA-Z]*\s*/, "")
        .replace(/```\s*$/, "");
    }

    try {
      const suggestions = JSON.parse(cleanedText);
      return Array.isArray(suggestions) ? suggestions : [];
    } catch (parseError) {
      console.warn("Failed to parse Gemini response:", cleanedText);
      console.error("Parse error:", parseError);

      // Fallback: try to extract JSON array from text
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const fallbackSuggestions = JSON.parse(jsonMatch[0]);
          return Array.isArray(fallbackSuggestions) ? fallbackSuggestions : [];
        } catch (fallbackError) {
          console.error("Fallback parse also failed:", fallbackError);
        }
      }

      return [];
    }
  } catch (error) {
    console.error("Error generating suggestions:", error);
    throw error;
  }
};
