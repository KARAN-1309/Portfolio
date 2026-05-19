import { useState, useRef, useEffect } from 'react';

// Embedded Cyberpunk Styles for the Chat Widget
const CHATBOT_STYLES = `
  .chatbot-wrapper {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .chatbot-trigger {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: #0a0a0e;
    box-shadow: 0 0 20px rgba(215, 35, 35, 0.5);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .chatbot-trigger::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 2px dashed #D72323;
    animation: rotateRing 10s linear infinite;
    transition: all 0.3s ease;
  }

  .chatbot-trigger:hover {
    transform: scale(1.08);
    box-shadow: 0 0 30px rgba(0, 243, 255, 0.6);
  }

  .chatbot-trigger:hover::before {
    border-color: #00f3ff;
    animation-duration: 4s;
  }

  .trigger-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #050507;
    overflow: hidden;
    position: relative;
    z-index: 2;
    border: 2px solid #0a0a0e;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .trigger-avatar img {
    width: 85%;
    height: 85%;
    object-fit: contain;
  }

  .chat-window {
    width: 380px; 
    height: 550px; 
    max-height: 75vh;
    background: rgba(5, 5, 7, 0.95);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(0, 243, 255, 0.4);
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
    transform-origin: bottom right;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.9);
    position: relative;
    overflow: hidden;
  }

  .chat-window.hidden {
    opacity: 0;
    transform: scale(0.4) translateY(100px);
    pointer-events: none;
  }

  .chat-window.visible {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: auto;
  }

  .chat-header {
    background: rgba(10, 10, 14, 0.95);
    border-bottom: 1px solid rgba(215, 35, 35, 0.4);
    padding: 1rem 1.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 10;
  }

  .chat-header-title {
    font-family: 'Orbitron', monospace;
    font-size: 0.9rem;
    color: #F5EDED;
    letter-spacing: 0.15em;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .status-dot {
    width: 10px;
    height: 10px;
    background: #00f3ff;
    border-radius: 50%;
    box-shadow: 0 0 12px #00f3ff;
    animation: pulseCyan 2s infinite;
  }

  .header-actions {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .clear-btn {
    background: none;
    border: 1px solid rgba(215, 35, 35, 0.5);
    color: #D72323;
    font-family: 'Orbitron', monospace;
    font-size: 0.6rem;
    padding: 0.3rem 0.6rem;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.2s;
  }
  .clear-btn:hover {
    background: #D72323;
    color: #0a0a0e;
    box-shadow: 0 0 10px rgba(215, 35, 35, 0.5);
  }

  .close-btn {
    background: none;
    border: none;
    color: #D72323;
    font-family: monospace;
    font-size: 1.4rem;
    cursor: pointer;
    transition: all 0.2s;
    line-height: 1;
  }
  .close-btn:hover {
    color: #00f3ff;
    transform: scale(1.2);
  }

  .chat-body {
    flex: 1;
    padding: 1.5rem 1.2rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    position: relative;
    z-index: 5;
  }
  
  .chat-body::-webkit-scrollbar { width: 4px; }
  .chat-body::-webkit-scrollbar-thumb { background: rgba(0, 243, 255, 0.3); }

  .message {
    max-width: 88%;
    padding: 0.9rem 1.2rem;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.1rem;
    line-height: 1.5;
    position: relative;
    animation: messageSlideIn 0.3s ease-out forwards;
  }

  .message.bot {
    align-self: flex-start;
    background: rgba(0, 243, 255, 0.08);
    border-left: 2px solid #00f3ff;
    color: #F5EDED;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .message.user {
    align-self: flex-end;
    background: rgba(215, 35, 35, 0.15);
    border-right: 2px solid #D72323;
    color: #F5EDED;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .message-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    position: absolute;
    top: -14px;
    background: #050507;
    border: 1px solid #00f3ff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .message.bot .message-avatar { left: -10px; }
  
  .message-avatar img {
    width: 80%;
    height: 80%;
    object-fit: contain;
  }

  .chat-footer {
    padding: 1.2rem;
    background: rgba(10, 10, 14, 0.95);
    border-top: 1px solid rgba(0, 243, 255, 0.3);
    display: flex;
    gap: 0.8rem;
    position: relative;
    z-index: 10;
  }

  .chat-input {
    flex: 1;
    background: rgba(5, 5, 7, 0.9);
    border: 1px solid rgba(0, 243, 255, 0.4);
    color: #00f3ff;
    padding: 0.8rem 1rem;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.05rem;
    outline: none;
    transition: all 0.3s;
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
  }

  .chat-input:focus {
    border-color: #00f3ff;
    background: rgba(0, 243, 255, 0.1);
  }

  .send-btn {
    background: rgba(215, 35, 35, 0.15);
    border: 1px solid #D72323;
    color: #D72323;
    padding: 0 1.2rem;
    cursor: pointer;
    font-family: 'Orbitron', monospace;
    font-size: 0.8rem;
    text-transform: uppercase;
    transition: all 0.3s;
    clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  }

  .send-btn:hover {
    background: #D72323;
    color: #0a0a0e;
  }

  .chat-scanline {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: rgba(0, 243, 255, 0.4);
    animation: chatScan 4s linear infinite;
    z-index: 1;
  }

  @keyframes pulseCyan { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  @keyframes chatScan { 0% { top: 0; } 100% { top: 100%; } }
  @keyframes rotateRing { 100% { transform: rotate(360deg); } }
  @keyframes messageSlideIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
`;

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Greetings. I am K-1, Karan's digital assistant. How can I help you navigate the databanks today?"
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const handleClearMemory = () => {
    setMessages([{ id: Date.now(), sender: 'bot', text: "[ NEURAL CACHE CLEARED ] Databanks reset. How may I assist you, Operator?" }]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('https://myportfolio-m5rr.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: messages, message: userText }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: data.reply.replace(/\*\*(.*?)\*\*/g, '$1') }]);
      } else throw new Error(data.error);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: "[ ERR: Neural link to Port 5005 severed. ]" }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <style>{CHATBOT_STYLES}</style>
      <div className="chatbot-wrapper">
        <div className={`chat-window ${isOpen ? 'visible' : 'hidden'}`}>
          <div className="chat-scanline" />
          <div className="chat-header">
            <div className="chat-header-title"><div className="status-dot" />K-1 // AI_CORE</div>
            <div className="header-actions">
              <button className="clear-btn" onClick={handleClearMemory}>Clear</button>
              <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
            </div>
          </div>
          <div className="chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                {msg.sender === 'bot' && <div className="message-avatar"><img src="/K-1_Chatbot.png" alt="K-1" /></div>}
                <span style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</span>
              </div>
            ))}
            {isTyping && <div className="message bot"><div className="message-avatar"><img src="/K-1_Chatbot.png" alt="K-1" /></div>[ K-1 IS PROCESSING... ]</div>}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-footer" onSubmit={handleSend}>
            <input ref={inputRef} type="text" className="chat-input" placeholder="[ INPUT QUERY... ]" value={input} onChange={(e) => setInput(e.target.value)} disabled={isTyping} autoComplete="off" />
            <button type="submit" className="send-btn" disabled={isTyping || !input.trim()}>Send</button>
          </form>
        </div>
        <div className="chatbot-trigger" onClick={() => setIsOpen(!isOpen)} title="Access K-1 Assistant">
          <div className="trigger-avatar"><img src="/K-1_Chatbot.png" alt="K-1 AI Assistant" /></div>
        </div>
      </div>
    </>
  );
}