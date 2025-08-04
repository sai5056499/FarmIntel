document.addEventListener('DOMContentLoaded', () => {
  const chatLog = document.getElementById('chat-log');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const statusArea = document.getElementById('status-area');

  function addMessage(text, sender) {
    const messageElement = document.createElement('p');
    messageElement.textContent = text;
    messageElement.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Scroll to bottom
  }

  function setStatus(text, isError = false) {
    statusArea.textContent = text;
    statusArea.style.color = isError ? 'red' : '#777';
  }

  async function handleSend() {
    const query = userInput.value.trim();
    if (!query) return;

    addMessage(`User: ${query}`, 'user');
    userInput.value = '';
    setStatus('AI is thinking...');
    sendButton.disabled = true;
    userInput.disabled = true;

    try {
      // Send message to background script
      const response = await chrome.runtime.sendMessage({
        action: "process_chat",
        query: query
      });

      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
        addMessage(`AI: Error - ${chrome.runtime.lastError.message}`, 'ai');
        setStatus(`Error: ${chrome.runtime.lastError.message}`, true);
      } else if (response && response.aiResponse) {
        addMessage(`AI: ${response.aiResponse}`, 'ai');
        setStatus('');
      } else if (response && response.error) {
        addMessage(`AI: Error - ${response.error}`, 'ai');
        setStatus(`Error: ${response.error}`, true);
      } else {
        addMessage("AI: Sorry, I couldn't get a response.", 'ai');
        setStatus("Failed to get AI response.", true);
      }
    } catch (error) {
      console.error("Error in popup processing:", error);
      addMessage(`AI: An unexpected error occurred: ${error.message}`, 'ai');
      setStatus(`Error: ${error.message}`, true);
    } finally {
      sendButton.disabled = false;
      userInput.disabled = false;
      userInput.focus();
    }
  }

  sendButton.addEventListener('click', handleSend);
  userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  });

  // Check API key status on load (optional visual cue)
  chrome.runtime.sendMessage({ action: "check_api_key_status" }, (response) => {
    // This message isn't handled by current background.js, but you could add it
    // For example, to check if OPENAI_API_KEY in background.js is still the placeholder
    // For now, we'll just assume it's okay or user will see errors.
  });

}); 