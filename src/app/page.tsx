"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

export default function Home() {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [dailyTopic, setDailyTopic] = useState("Tap 'New Challenge' to start your writing journey");
  const [maxWords, setMaxWords] = useState(200);
  const [darkMode, setDarkMode] = useState(false);

  const challenges = [
    "Describe your ideal day with no constraints.",
    "If you could talk to your 10-year-old self, what would you say?",
    "Tell a funny anecdote that happened to you.",
  ];

  useEffect(() => {
    setWordCount(
      text.trim().split(/\s+/).filter((word) => word.length > 0).length
    );
  }, [text]);

  const generateTopic = () => {
    setDailyTopic(challenges[Math.floor(Math.random() * challenges.length)]);
  };

  return (
    <>
      <Navbar />
      {/* Wrapper global pour centrer le contenu avec un padding adapté */}
      <div className="px-4 py-8">
        {/* Le conteneur principal utilise .app-container qui est désormais responsive */}
        <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
          {/* Challenge Section */}
          <div className="challenge-section">
            <div className="challenge-controls flex flex-wrap gap-4 mb-4">
              <button onClick={generateTopic} className="btn" id="generate-topic">
                New Challenge
              </button>
            </div>
            <div className="daily-challenge" id="daily-topic">
              {dailyTopic}
            </div>
          </div>

          {/* Goal Section */}
          <div className="goal-selector mb-6">
            <label htmlFor="goal-range">
              Daily word count goal: <span id="goal-value">{maxWords}</span>
            </label>
            <input
              type="range"
              id="goal-range"
              min="200"
              max="1000"
              step="100"
              value={maxWords}
              onChange={(e) => setMaxWords(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          {/* Writing Section */}
          <div className="writing-area mb-6">
            <textarea
              placeholder="Start writing your thoughts..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border border-gray-300 p-4 rounded-lg"
            ></textarea>
            <div id="word-count" className="text-right mt-2 font-bold">
              Words: {wordCount}
            </div>
          </div>

          {/* Progress Section */}
          <div className="progress-container mb-6">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${Math.min((wordCount / maxWords) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn btn-primary w-full" id="save-text">
              Save Progress
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
