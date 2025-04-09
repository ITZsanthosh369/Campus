import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/ChatFeed.css';

const GroupChatFeed = ({ groupName, groupDescription, messages = [], onSendMessage, isLoading = false }) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Dynamic textarea height adjustment
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Reset height to auto to properly calculate scroll height
    e.target.style.height = 'auto';
    // Set the height to scroll height (content height)
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
      
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
      
      // Focus back on input
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Group messages by date for date separators
  const messagesByDate = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  // Get first letter of a name for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  // Determine if a message is from the current user
  const isCurrentUser = (senderId) => {
    return user && senderId === user._id;
  };

  // Determine message class based on sender role and type
  const getMessageClass = (message) => {
    if (message.isSystem) {
      return `message-system ${message.type || ''}`;
    }
    
    if (isCurrentUser(message.sender._id)) {
      return `message-user ${user.role}`;
    }
    
    return `message-system`;
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-icon">
          {getInitial(groupName)}
        </div>
        <div>
          <h2 className="chat-header-title">{groupName}</h2>
          {groupDescription && (
            <p className="chat-header-subtitle">{groupDescription}</p>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container" ref={messagesContainerRef}>
        {isLoading ? (
          <div className="messages-loading">
            <div className="dot-flashing"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-messages">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3>No messages yet</h3>
            <p>Be the first to send a message in this group!</p>
          </div>
        ) : (
          Object.keys(messagesByDate).map(date => (
            <React.Fragment key={date}>
              <div className="date-separator">
                {formatDate(date)}
              </div>
              {messagesByDate[date].map((message, index) => (
                <div key={message._id || index} className={getMessageClass(message)}>
                  <div className="message-bubble">
                    <div className="message-content">{message.content}</div>
                  </div>
                  <div className="message-meta">
                    <span className="message-sender">
                      {message.isSystem ? 'System' : message.sender.name}
                    </span>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="chat-input-container">
        <textarea
          ref={inputRef}
          className="chat-input"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type your message..."
          rows="1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!newMessage.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default GroupChatFeed;
