"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const QuestionsPage = () => {
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [trope, setTrope] = useState("");
  const [timeSpan, setTimeSpan] = useState("");
  const [numRecommendations, setNumRecommendations] = useState(1);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { genre, mood, trope, timeSpan, numRecommendations };

    // Send the data to the API route
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();

      // Log the result to check the structure
      console.log("API result:", result);

      // Store the structured recommendations in localStorage.
      localStorage.setItem("recommendations", JSON.stringify(result.recommendations));

      // Navigate to the recommendations page
      router.push("/recommendations");
    } else {
      console.error("Failed to fetch recommendations");
    }
  };

  return (
    <div>
      <h1>Answer a few questions</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Favorite Genre:
          <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required />
        </label>
        <br />
        <label>
          Current Mood:
          <input type="text" value={mood} onChange={(e) => setMood(e.target.value)} required />
        </label>
        <br />
        <label>
          Favorite Anime Trope:
          <input type="text" value={trope} onChange={(e) => setTrope(e.target.value)} required />
        </label>
        <br />
        <label>
          Time span (hours/days):
          <input type="text" value={timeSpan} onChange={(e) => setTimeSpan(e.target.value)} required />
        </label>
        <br />
        <label>
          Number of recommendations (1/10/20):
          <input
            type="number"
            value={numRecommendations}
            onChange={(e) => setNumRecommendations(e.target.value)}
            min="1"
            max="20"
            required
          />
        </label>
        <br />
        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default QuestionsPage;
