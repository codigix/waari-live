import React, { useState } from "react";
import AIAssistant from "./AIAssistant";
import "./FloatingAIButton.scss";

const FloatingAIButton = () => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        className="floating-ai-btn"
        onClick={() => setIsAIAssistantOpen(true)}
        title="Chat with AI Assistant"
        aria-label="AI Assistant Chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="floating-ai-badge">AI</span>
      </button>

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />
    </>
  );
};

export default FloatingAIButton;
