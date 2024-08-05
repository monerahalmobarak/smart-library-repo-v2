// /Users/malmobarak001/All_Vscode/myprojectforbooks/frontend/src/components/ChatBot/chat.tsx
import React, { useState, ChangeEvent, KeyboardEvent } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatProps {
  isVisible: boolean;
  closeChat: () => void;
}

const Chat: React.FC<ChatProps> = ({ isVisible, closeChat }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    
    const sendMessageToServer = async (message) => {
        const bodyData = {
          question: message,
          chat_history: [] 
        };
      
        try {
          const response = await fetch('http://localhost:8000/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
          });
          if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Server response:', data);
          setMessages(prevMessages => [...prevMessages, { text: data.answer, sender: 'bot' }]);
        } catch (error) {
          console.error('Failed to send message:', error);
        }
      }
      

    const sendMessage = (): void => {
        if (input.trim()) {
            const newMessage: Message = { text: input, sender: 'user' };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setInput('');

            sendMessageToServer(input);
        }
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <button onClick={closeChat}>Close Chat</button>
        </div>
    );
};

export default Chat;

