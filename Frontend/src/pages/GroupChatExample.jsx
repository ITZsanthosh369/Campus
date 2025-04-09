import React, { useState, useEffect } from 'react';
import GroupChatFeed from '../components/GroupChatFeed';
import { useAuth } from '../context/AuthContext';

const GroupChatExample = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data fetching
  useEffect(() => {
    const fetchMessages = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock messages data
      const mockMessages = [
        {
          _id: '1',
          content: 'Welcome to the Computer Science Department group!',
          isSystem: true,
          type: 'notification',
          sender: { _id: 'system', name: 'System' },
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '2',
          content: 'Important: The midterm exam schedule has been posted. Please check the department website for details.',
          isSystem: true,
          type: 'important',
          sender: { _id: 'system', name: 'System' },
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '3',
          content: 'Hi everyone, I have a question about the upcoming project deadline. Has it been extended?',
          isSystem: false,
          sender: { _id: 'user1', name: 'Jane Smith' },
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '4',
          content: 'Yes, the deadline has been extended by one week. The new submission date is November 15th.',
          isSystem: false,
          sender: { _id: 'faculty1', name: 'Dr. Robert Chen' },
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString()
        },
        {
          _id: '5',
          content: 'Thank you for the information!',
          isSystem: false,
          sender: { _id: 'user1', name: 'Jane Smith' },
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString()
        },
        {
          _id: '6',
          content: 'Announcement: The guest lecture by Dr. Alan Turing has been scheduled for this Friday at 3:00 PM in the Main Hall.',
          isSystem: true,
          type: 'announcement',
          sender: { _id: 'system', name: 'System' },
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '7',
          content: "I'm looking forward to the guest lecture! Does anyone want to meet up beforehand to discuss potential questions?",
          isSystem: false,
          sender: { _id: user?._id || 'currentUser', name: user?.name || 'Current User' },
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '8',
          content: "That's a great idea! I'll join you. How about we meet at the library at 2:00 PM?",
          isSystem: false,
          sender: { _id: 'user3', name: 'Michael Johnson' },
          timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setMessages(mockMessages);
      setIsLoading(false);
    };

    fetchMessages();
  }, [user]);

  const handleSendMessage = (messageContent) => {
    // Add new message to the list
    const newMessage = {
      _id: Date.now().toString(),
      content: messageContent,
      isSystem: false,
      sender: { 
        _id: user?._id || 'currentUser', 
        name: user?.name || 'Current User' 
      },
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Computer Science Department</h1>
      <div className="mb-8">
        <GroupChatFeed 
          groupName="Computer Science Department" 
          groupDescription="Official communication channel for CS department"
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default GroupChatExample;
