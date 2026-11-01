import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

// Asks the backend for a one-sentence example of a screener question.
// The Gemini key stays on the server, so it never ships to the browser.
const AIResponse = ({ prompt }) => {
  const [responseText, setResponseText] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setResponseText("");
    setFailed(false);

    axiosInstance
      .post("/ai/explain", { question: prompt })
      .then((res) => {
        if (!cancelled) setResponseText(res.data.text);
      })
      .catch((error) => {
        console.error("Error fetching AI response:", error);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [prompt]);

  if (failed) return <p>Sorry, couldn&apos;t load an example right now.</p>;
  return (
    <div>
      <p>{responseText || "Loading..."}</p>
    </div>
  );
};

export default AIResponse;
