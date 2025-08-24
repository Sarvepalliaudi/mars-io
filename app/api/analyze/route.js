// app/api/analyze/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const { genre, mood, trope, timeSpan, numRecommendations } = await req.json();

  try {
    // Initialize the Generative AI model with your API key
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    // Get the Gemini AI model (ensure your model name and options are correct)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct a prompt that asks for a JSON array output.
    const prompt = `I want ${numRecommendations} anime recommendations. 
    My favorite genre is "${genre}", my current mood is "${mood}", I like "${trope}" in anime. 
    Please return your recommendations as a JSON array of objects, where each object has a "title" property.`;

    // Generate the response from the Gemini AI model
    const result = await model.generateContent([prompt]);

    // Get the text response and extract recommendations
    const recommendationsText = result.response.text;

    // Try parsing the response into a JSON array
    let recommendations;
    try {
      recommendations = JSON.parse(recommendationsText);
    } catch (parseError) {
      // If parsing fails, log an error and fallback to an empty array.
      console.error("Failed to parse recommendations as JSON:", parseError);
      recommendations = [];
    }

    // Return the recommendations in a JSON response
    return new Response(JSON.stringify({ recommendations }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
      
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch recommendations" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
