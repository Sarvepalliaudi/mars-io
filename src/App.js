import React, { useState } from "react"; 
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { Loader, Compass } from "lucide-react";
import MarkdownIt from "markdown-it";

function App() {
  const [mood, setMood] = useState("");
  const [tropes, setTropes] = useState("");
  const [numRecommendations, setNumRecommendations] = useState(3);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleMoodChange = (event) => {
    setMood(event.target.value);
  };

  const handleTropesChange = (event) => {
    setTropes(event.target.value);
  };

  const handleNumRecommendationsChange = (event) => {
    setNumRecommendations(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!mood || !tropes) {
      alert("Please enter both mood and tropes.");
      return;
    }
  
    setIsLoading(true);
    setRecommendations([]); // Clear previous recommendations
  
    try {
      const contents = [
        {
          role: "user",
          parts: [
            { text: `Give me ${numRecommendations} anime recommendations based on the mood '${mood}' and the tropes '${tropes}'. Only return a list of recommendations without any additional text.` },
          ],
        },
      ];
  
      const GEMINI_API_KEY = "AIzaSyDlqSN72rMznHQ_mJFNoKh1Atw4xcWwaVI";
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      });
  
      const result = await model.generateContentStream({ contents });
  
      let buffer = [];
      const md = new MarkdownIt();
      for await (let response of result.stream) {
        buffer.push(response.text());
      }
  
      const responseText = buffer.join("").replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags
      const recommendationsArray = responseText.split("\n").filter((item) => item.trim() !== "");
      setRecommendations(recommendationsArray);
  
      // Optionally read the output aloud
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(responseText);
      synth.speak(utterance);
    } catch (error) {
      console.error("Error:", error);
      setRecommendations(["An error occurred while generating content."]);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="anime-app" style={{ backgroundColor: "#121212", color: "#fff", padding: "20px", fontFamily: "'Poppins', sans-serif", minHeight: "100vh" }}>
      <h1 className="anime-title" style={{ textAlign: "center", fontSize: "3rem", color: "#9a4c95", marginBottom: "30px" }}>
        Anime Recommender
      </h1>
      <form onSubmit={handleSubmit} className="anime-form" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div className="anime-input-group" style={{ marginBottom: "20px" }}>
          <label htmlFor="mood">Mood:</label>
          <input
            type="text"
            id="mood"
            value={mood}
            onChange={handleMoodChange}
            placeholder="Enter your mood (e.g., intense, romantic)"
            className="anime-input"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              marginTop: "10px",
              backgroundColor: "#292929",
              color: "#fff",
            }}
          />
        </div>

        <div className="anime-input-group" style={{ marginBottom: "20px" }}>
          <label htmlFor="tropes">Favorite Tropes:</label>
          <input
            type="text"
            id="tropes"
            value={tropes}
            onChange={handleTropesChange}
            placeholder="Enter tropes (e.g., action, time travel)"
            className="anime-input"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              marginTop: "10px",
              backgroundColor: "#292929",
              color: "#fff",
            }}
          />
        </div>

        <div className="anime-input-group" style={{ marginBottom: "20px" }}>
          <label htmlFor="numRecommendations">Number of Recommendations:</label>
          <input
            type="number"
            id="numRecommendations"
            value={numRecommendations}
            onChange={handleNumRecommendationsChange}
            min="1"
            max="10"
            className="anime-input"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              marginTop: "10px",
              backgroundColor: "#292929",
              color: "#fff",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="anime-button"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#9a4c95",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          {isLoading ? <Loader className="anime-loader" width={24} height={24} color="white" /> : <Compass className="anime-compass" width={24} height={24} color="white" />}
          Get Recommendations
        </button>
      </form>

      <div className="anime-recommendations" style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div key={index} className="anime-card" style={{
              backgroundColor: "#1f1f1f",
              borderRadius: "12px",
              padding: "20px",
              border: "2px solid #9a4c95",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
            }}>
              <h3 style={{ color: "#ff6f61", fontSize: "1.5rem", marginBottom: "10px" }}>Recommendation {index + 1}</h3>
              <p style={{ fontSize: "1.1rem", color: "#d4d4d4" }}>{rec}</p>
            </div>
          ))
        ) : (
          !isLoading && <p>No recommendations yet. Fill out the form and submit!</p>
        )}
      </div>
    </div>
  );
}

export default App;

