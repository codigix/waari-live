const { callHuggingFaceAPI } = require("../services/huggingFaceService");

exports.processQuery = async (req, res) => {
  try {
    const { message, history } = req.body ?? {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, error: "message is required" });
    }

    const aiResponse = await callHuggingFaceAPI(message, Array.isArray(history) ? history : []);

    const normalizedResponse =
      typeof aiResponse === "string"
        ? { text: aiResponse }
        : aiResponse && typeof aiResponse === "object"
        ? aiResponse
        : { text: "" };

    return res.status(200).json({ success: true, data: normalizedResponse });
  } catch (error) {
    console.error("AI controller error:", error.message);
    return res.status(500).json({ success: false, error: "Unable to process request" });
  }
};
