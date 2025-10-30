import React, { useState } from "react";
import AIAssistant from "../../layouts/AIAssistant";
import "./FloatingAIButton.scss";

const FloatingAIButton = () => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  return (
    <>
      {/* Floating AI Button */}
      <button
        className="floating-ai-button"
        onClick={() => setIsAIAssistantOpen(true)}
        title="Open AI Assistant"
        aria-label="AI Assistant"
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
          <path d="M12 8V4m0 16v-4m8-8h-4m-8 0H4m11.313 11.313l2.828-2.828m-5.656 0l-2.828 2.828m0-5.656l2.828-2.828m-5.656 0l2.828 2.828" />
        </svg>
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
