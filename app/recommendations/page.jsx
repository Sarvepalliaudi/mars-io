"use client";
import { useEffect, useState } from "react";

const RecommendationsPage = () => {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    // Retrieve recommendations from localStorage
    const storedRecommendations = localStorage.getItem("recommendations");

    // Log the stored recommendations
    console.log("Stored recommendations:", storedRecommendations);

    if (storedRecommendations) {
      try {
        const parsedRecommendations = JSON.parse(storedRecommendations);

        // Ensure parsedRecommendations is an array
        if (Array.isArray(parsedRecommendations)) {
          setAnimeList(parsedRecommendations);
        } else {
          console.error("Stored recommendations are not an array:", parsedRecommendations);
        }
      } catch (error) {
        console.error("Error parsing stored recommendations:", error);
      }
    }
  }, []);

  return (
    <div>
      <h1>Anime Recommendations</h1>
      {animeList.length > 0 ? (
        <ul>
          {animeList.map((anime, index) => (
            <li key={index}>{anime.title}</li>
          ))}
        </ul>
      ) : (
        <p>No recommendations available</p>
      )}
    </div>
  );
};

export default RecommendationsPage;
