// AI generation logic for Gemini API

export async function generateAISuggestions(jobDescription, apiKey) {
  const prompt = `Based on this job description, generate 3-5 bullet point suggestions for a resume's experience section. Focus on actionable verbs and quantifiable results. Job Description: "${jobDescription}"`;
  const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await response.json();

  let suggestionsArray = [];
  if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
    const text = result.candidates[0].content.parts[0].text;
    suggestionsArray = text.split('\n').filter(line => line.trim().startsWith('*') || line.trim().startsWith('-')).map(line => line.replace(/^([*-])\t?/, '').trim());
  }
  return suggestionsArray;
}

export async function correctText(textToCorrect, apiKey) {
  const prompt = `Correct the grammar, spelling, and punctuation of the following text, and suggest improvements for clarity and conciseness. Only return the corrected text. Text: "${textToCorrect}"`;
  const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await response.json();

  if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
    return result.candidates[0].content.parts[0].text;
  }
  return '';
} 