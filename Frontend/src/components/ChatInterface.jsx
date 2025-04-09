import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ChatInterface = ({ groupType }) => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('user') 
          ? JSON.parse(localStorage.getItem('user')).token 
          : '';
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`/api/v1/messages`, {
          ...config,
          params: { groupType, groupId }
        });

        if (response.data.success) {
          setMessages(response.data.messages);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err.response?.data?.message || 'Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };

    if (groupId && groupType) {
      fetchMessages();
    }
  }, [groupId, groupType]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      const token = localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user')).token 
        : '';
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const messageData = {
        groupType,
        groupId,
        content: newMessage.trim()
      };

      const response = await axios.post('/api/v1/messages/send', messageData, config);
      
      if (response.data.success) {
        // Add new message to the list
        setMessages([...messages, response.data.message]);
        // Clear input field
        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 border rounded-lg shadow-md p-4 bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <div className="mb-4 border-b pb-2">
        <h2 className="text-xl font-semibold">Group Chat</h2>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {/* Messages container */}
      <div className="h-96 overflow-y-auto mb-4 p-2 border rounded bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div 
                key={message._id} 
                className={`p-3 rounded-lg max-w-[80%] ${
                  message.sender._id === user?._id 
                    ? 'ml-auto bg-indigo-100' 
                    : 'bg-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm">
                    {message.sender.name}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatTime(message.timestamp || message.createdAt)}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message input form */}
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700 disabled:bg-indigo-300 transition duration-200"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
