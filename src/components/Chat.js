import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

const ENDPOINT = 'http://localhost:3000/visitors';
const AGENT_MESSAGE_ENDPOINT = 'http://localhost:3007/message';
const FEEDBACK_ENDPOINT = 'http://localhost:3001/feedback';

const Chat = ({ oldClientData }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (oldClientData) {
      // Set messages from oldClientData.messages
      setMessages(oldClientData.messages);
    } else {
      fetchMessages();
    }
    
    const timerId = setInterval(fetchAgentMessages, 3000);
    return () => clearInterval(timerId);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(ENDPOINT);
      const clientMessages = Array.isArray(response.data.messages) ? response.data.messages : [];
      setMessages(clientMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const fetchAgentMessages = async () => {
    try {
      const agentResponse = await axios.get(AGENT_MESSAGE_ENDPOINT);
      const agentMessages = Array.isArray(agentResponse.data) ? agentResponse.data : [];
      setMessages(prevMessages => {
        const newMessages = [...prevMessages, ...agentMessages].filter((msg, index, self) =>
          index === self.findIndex((t) => t.id === msg.id)
        );
        return newMessages;
      });
    } catch (error) {
      console.error('Error fetching agent messages:', error);
    }
  };

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        user: 'Client',
        message,
        timestamp: new Date().toISOString(),
      };

      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');

      try {
        await axios.post(ENDPOINT, newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const submitRatingAndComment = async () => {
    try {
      const feedback = {
        rating,
        comment,
        timestamp: new Date().toISOString(),
      };
      await axios.post(FEEDBACK_ENDPOINT, feedback);
      setRating(0);
      setComment('');
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

    return (
        <div className='chats-container'>
            {isChatOpen ? (
                <div className="chat-container">
                    <div className="chat-header">
                        <h1>Live Chat</h1>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`chat-message ${msg.user === 'Client' ? 'client' : 'agent'}`}
                            >
                                <div className="content">
                                    <div className="user">{msg.user}</div>
                                    <div>{msg.message}</div>
                                    <div className="time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message"
                        />
                        <button onClick={sendMessage}>Send</button>
                        <button onClick={closeChat} className="close-chat-button">Close Chat</button>
                    </div>
                </div>
            ) : (
                <div className="feedback-container">
                    <h2>Rate the Conversation</h2>
                    <div className="rating">
                        {[1, 2, 3, 4, 5].map(star => (
                            <span
                                key={star}
                                className={`star ${rating >= star ? 'filled' : ''}`}
                                onClick={() => handleRatingChange(star)}
                            >
                                &#9733;
                            </span>
                        ))}
                    </div>
                    <textarea
                        placeholder="Leave a comment"
                        value={comment}
                        onChange={handleCommentChange}
                    />
                    <button onClick={submitRatingAndComment}>Submit</button>
                </div>
            )}
        </div>
    );
};

export default Chat;
