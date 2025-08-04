// --- CONFIGURATION ---
const NVIDIA_API_BASE_URL = "https://integrate.api.nvidia.com/v1";
// IMPORTANT: Replace with your actual NVIDIA API key
// For a real extension, get this from chrome.storage.local after user sets it on an options page.
const NVIDIA_API_KEY = "nvapi-JK9QlvOXGPBS_MvIMHIYxX9oImfe6pjgTApQelBURmoh3w_PtUOJ4kDot5EsLMudnvapi-EurjmPvDeUHDMnkphFLTge1qF8sbbhTOnYzZvP7rhwcntBena4IN4ED5wcaP8V53"; // <<<<< REPLACE THIS WITH YOUR ACTUAL KEY

// Use a known working NVIDIA model ID from their documentation
const AI_MODEL_ID = "qwen/qwen3-235b-a22b"; // Known working model for NVIDIA's OpenAI-compatible endpoint

// --- HELPER FUNCTIONS --- (getActiveTab and getPageContent remain the same)
async function getActiveTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function getPageContent(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
    const response = await chrome.tabs.sendMessage(tabId, { action: "get_page_content" });
    if (chrome.runtime.lastError) {
        console.error("Error sending message to content script:", chrome.runtime.lastError.message);
        return "Error: Could not communicate with the page. It might be a restricted page or has been closed.";
    }
    return response && response.content ? response.content : "";
  } catch (e) {
    console.error("Error injecting or communicating with content script:", e);
    if (e.message.includes("Cannot access a chrome:// URL") || e.message.includes("Cannot access contents of the page")) {
        console.warn("Cannot access content on this page (e.g., chrome://, extensions page, or other protected pages).");
        return "Error: Cannot access content on this page.";
    }
    return null;
  }
}


async function callNvidiaAI(pageContent, userQuery) {
  if (NVIDIA_API_KEY === "YOUR_NVIDIA_API_KEY_HERE") {
    return "Error: NVIDIA API key not configured in background.js.";
  }
  if (AI_MODEL_ID === "YOUR_NVIDIA_MODEL_ID_HERE" || AI_MODEL_ID === "") {
    return "Error: NVIDIA AI_MODEL_ID not configured in background.js.";
  }
  if (pageContent === "Error: Cannot access content on this page." || pageContent === "Error: Could not communicate with the page. It might be a restricted page or has been closed.") {
    return pageContent; // Propagate error
  }

  const MAX_CONTENT_LENGTH = 10000; // Adjust based on model's context window
  let truncatedPageContent = pageContent.substring(0, MAX_CONTENT_LENGTH);
  if (pageContent.length > MAX_CONTENT_LENGTH) {
    truncatedPageContent += "\n[Content truncated]";
  }

  const prompt = `
You are a helpful AI assistant.
The user is viewing a web page with the following content.
Use this content to answer the user's question. If the question cannot be answered
from the content, say so. Be concise.

Page Content:
---
${truncatedPageContent}
---

User's Question: "${userQuery}"

Your Answer:
  `;

  // The endpoint for chat completions, similar to OpenAI
  const API_ENDPOINT = `${NVIDIA_API_BASE_URL}/chat/completions`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${NVIDIA_API_KEY}` // Standard Bearer token
      },
      body: JSON.stringify({
        model: AI_MODEL_ID, // The specific model ID for NVIDIA's API
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,    // Adjust as needed
        temperature: 0.5,   // Adjust as needed
        // stream: false,   // Set to true if you want to handle streaming responses
      })
    });

    let responseBody;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
      console.error("NVIDIA API Non-JSON Response:", responseBody);
    }

    if (!response.ok) {
      let errorMessage = `NVIDIA API Error: ${response.status} ${response.statusText}`;
      if (typeof responseBody === "object" && responseBody.error && responseBody.error.message) {
        errorMessage += ` - ${responseBody.error.message}`;
      } else if (typeof responseBody === "object" && responseBody.detail) {
        errorMessage += ` - ${responseBody.detail}`;
      } else if (typeof responseBody === "string") {
        errorMessage += ` - ${responseBody}`;
      }
      throw new Error(errorMessage);
    }

    // Assuming NVIDIA's OpenAI-compatible endpoint returns a similar structure
    if (responseBody.choices && responseBody.choices[0] && responseBody.choices[0].message && responseBody.choices[0].message.content) {
      return responseBody.choices[0].message.content.trim();
    } else {
      console.warn("Unexpected response structure from NVIDIA AI:", responseBody);
      return "No valid response text from AI. Check console for details.";
    }

  } catch (error) {
    console.error("Error calling NVIDIA AI:", error);
    return `Error communicating with AI: ${error.message}`;
  }
}

// --- MESSAGE LISTENER --- (Updated to call callNvidiaAI)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "process_chat") {
    (async () => {
      const activeTab = await getActiveTab();
      if (!activeTab || !activeTab.id) {
        sendResponse({ error: "Could not get active tab." });
        return;
      }

      if (activeTab.url && (activeTab.url.startsWith("chrome://") || activeTab.url.startsWith("edge://") || activeTab.url.startsWith("about:"))) {
        sendResponse({ aiResponse: "Sorry, I cannot access content on browser utility pages (e.g., chrome://, settings, etc.)." });
        return;
      }

      const pageContent = await getPageContent(activeTab.id);
       if (pageContent === null && !chrome.runtime.lastError) {
          sendResponse({ aiResponse: "Error: Could not retrieve page content. The page might be protected or an internal browser page." });
          return;
      }
      if (pageContent === "Error: Cannot access content on this page." || pageContent === "Error: Could not communicate with the page. It might be a restricted page or has been closed.") {
        sendResponse({ aiResponse: pageContent });
        return;
      }

      const aiResponse = await callNvidiaAI(pageContent, request.query); // Changed here
      sendResponse({ aiResponse: aiResponse });
    })();
    return true; // Indicates you wish to send a response asynchronously
  }
});

console.log("Background script (NVIDIA AI) loaded.");