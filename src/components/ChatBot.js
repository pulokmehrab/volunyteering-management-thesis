import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: inputMessage, sender: "user" }];
    setMessages(newMessages);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
    }, 1000);
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! How can I assist you today?";
    } else if (lowerMessage.includes('volunteer')) {
      return "To volunteer with us, you can register through our 'Get Started' button at the top of the page!";
    } else if (lowerMessage.includes('event')) {
      return "We have various upcoming events. Check out our events section above for more details!";
    } else if (lowerMessage.includes('help')) {
      return "I can help you with information about volunteering, events, and general questions. What would you like to know?";
    } else {
      return "I'm not sure about that. Would you like to know more about our volunteering opportunities or upcoming events?";
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button className="chat-button" onClick={() => setIsOpen(true)}>
          <i className="fas fa-comments"></i>
        </button>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Chat Support</h3>
            <button onClick={() => setIsOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot; 