import React, { useState, useEffect} from 'react'

const Messages = () => {
    const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");


  // Fetch messages from API (mocked for now)
  useEffect(() => {
    const fetchMessages = async () => {
      // Replace with actual API call
      const mockMessages = [
        { id: 1, sender: "Admin", text: "Welcome to PayWise!", timestamp: "2025-03-14 10:00 AM" },
        { id: 2, sender: "Support", text: "Your transaction was successful.", timestamp: "2025-03-13 5:30 PM" }
      ];
      setMessages(mockMessages);
    };

    fetchMessages();
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageObj = {
      id: messages.length + 1,
      sender: "You",
      text: newMessage,
      timestamp: new Date().toLocaleString()
    };

    setMessages([...messages, messageObj]);
    setNewMessage(""); // Clear input after sending
  };
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 h-screen">
    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">📩 Messages</h2>

    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 h-96 overflow-y-auto">
      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="mb-4 p-2 border-b border-gray-300 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">{msg.timestamp}</p>
            <p className="font-semibold">{msg.sender}:</p>
            <p className="text-gray-800 dark:text-gray-200">{msg.text}</p>
          </div>
        ))
      )}
    </div>

    <div className="mt-4 flex">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-grow p-2 border rounded-l-md focus:outline-none"
        placeholder="Type your message..."
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  </div>
);
  
}

export default Messages
