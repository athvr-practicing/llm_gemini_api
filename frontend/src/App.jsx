import { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Send the user's message to the backend API
      const response = await fetch('http://localhost:3000/ai/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = { text: data.response, sender: 'ai' };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        const aiMessage = { text: "Sorry, something went wrong!", sender: 'ai' };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const aiMessage = { text: "Sorry, something went wrong!", sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h1 style={{textAlign: 'center'}}>LEGAL AID PROVIDER</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default App;
