import React, { useState } from "react";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import { Compass, Loader } from "lucide-react";
import MarkdownIt from "markdown-it";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("Results will appear here...");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    previewFile(file); // Set preview
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result); // Set preview to Base64 URL
    };
    reader.readAsDataURL(file);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    setIsLoading(true);
    setOutput("Generating...");

    try {
      const fileBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = reject;
      });

      const contents = [
        {
          role: "user",
          parts: [
            { inline_data: { mime_type: "image/jpeg", data: fileBase64 } },
            { text: prompt },
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

      const renderedOutput = buffer.join("").replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags
      setOutput(renderedOutput);

      // Read the output aloud
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(renderedOutput);
      synth.speak(utterance);
    } catch (error) {
      console.error("Error:", error);
      setOutput("An error occurred while generating content.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="App">
      {/* <div style="width:100%;height:0;padding-bottom:100%;position:relative;">
        <iframe
          className="frame"
          src="https://giphy.com/embed/tVM0hQmU52iKcLI1Kk"
          width="100%"
          height="100%"
          style="position:absolute"
          frameBorder="0"
          class="giphy-embed"
          allowFullScreen
        ></iframe>
      </div>
      <p>
        <a href="https://giphy.com/gifs/loop-retro-vhs-tVM0hQmU52iKcLI1Kk">
          via GIPHY
        </a>
      </p> */}
      <h1 className="title">
        Man<span>dex</span> - AI
      </h1>
      <form onSubmit={handleSubmit}>
        <div
          className="image-picker"
          style={{
            border: "4px dashed rgb(0, 47, 255)",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#222",
            color: "#fff",
            textAlign: "center",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Uploaded Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
          ) : (
            <p>
              Drag and drop an image file here, or <span>click to select</span>
            </p>
          )}
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            accept="image/*"
            capture
            style={{ display: "none" }}
          />
          <label
            className="select"
            htmlFor="fileInput"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              marginTop: "10px",
              backgroundColor: " rgb(0, 47, 255)",
              color: "#fff",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Select File
          </label>
        </div>
        <div className="prompt-box">
          <label>
            <input
              className="prompt"
              name="prompt"
              placeholder="Ast your question..."
              type="text"
              value={prompt}
              onChange={handlePromptChange}
            />
          </label>
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader className="loader" width={40} height={40} color="white" />
            ) : (
              <Compass
                className="compass"
                width={40}
                height={40}
                color="white"
              />
            )}
          </button>
        </div>
      </form>
      <pre
        className="output"
        style={{
          marginTop: "20px",
          whiteSpace: "pre-wrap",
          padding: "10px",
          background: "#0a0a0ab7",
          border: "2px dashed white",
        }}
      >
        {output}
      </pre>
    </div>
  );
}

export default App;
