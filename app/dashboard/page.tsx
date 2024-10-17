"use client";
import React, { useState, useEffect } from 'react';
import { Clipboard, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { nanoid } from 'nanoid';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [uniqueLink, setUniqueLink] = useState('');
  const [url, setUrl] = useState('');
  const { user } = useUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate or fetch the unique link from localStorage and store nanoid in url state
  useEffect(() => {
    const storedLink = localStorage.getItem('uniqueLink');
    if (storedLink) {
      setUniqueLink(storedLink);
      const generatedId = storedLink.split('/').pop();
      setUrl(generatedId || '');
    } else {
      const newId = nanoid();
      const newLink = `${window.location.origin}/sms/${newId}`;
      setUniqueLink(newLink);
      setUrl(newId);
      localStorage.setItem('uniqueLink', newLink);
    }
  }, []);

  // Send username and uniqueLink to the API when uniqueLink changes
  useEffect(() => {
    const registerUser = async () => {
      if (!user?.username || !uniqueLink) return;

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user.username,
            url: url,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.error || 'Error registering user');
        } else {
          setErrorMessage(null);
        }
      } catch (error) {
        console.error('Error registering user:', error);
        setErrorMessage('An unexpected error occurred');
      }
    };

    registerUser();
  }, [uniqueLink, user?.username, url]);

  // Fetch messages when the user is loaded
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.username) return;

      try {
        const response = await fetch(`/api/getMessages?username=${encodeURIComponent(user.username)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setErrorMessage('Failed to load messages');
      }
    };

    fetchMessages();
  }, [user?.username]);

  const handleCopy = () => {
    navigator.clipboard.writeText(uniqueLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const formatDate = (dateString: string | number | Date) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateContent = (content: string, maxLength = 50) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8"><Link href='/'>PookieSMS</Link></h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Message Inbox</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className="border-b border-gray-700 py-3 cursor-pointer hover:bg-gray-700 transition duration-300"
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold">{message.sender}</h3>
                      <span className="text-xs text-gray-400">{formatDate(message.sentAt)}</span>
                    </div>
                    <p className="text-sm text-gray-300">{truncateContent(message.content)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No messages yet.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Welcome, {user?.username}</h2>
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-2">Your Secret Link</h3>
              <p className="mb-2">Share this link to receive anonymous messages:</p>
              <div className="flex items-center bg-gray-700 rounded p-2">
                <input
                  type="text"
                  value={uniqueLink}
                  readOnly
                  className="bg-transparent flex-grow outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="ml-2 p-1 rounded hover:bg-gray-600 transition duration-300"
                >
                  <Clipboard size={20} />
                </button>
              </div>
              {copied && (
                <Alert className="mt-2 bg-green-800 border-green-600">
                  <AlertDescription>Link copied to clipboard!</AlertDescription>
                </Alert>
              )}
              {errorMessage && (
                <Alert className="mt-2 bg-red-800 border-red-600">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedMessage.sender}</h2>
                <p className="text-sm text-gray-400">{formatDate(selectedMessage.sentAt)}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded hover:bg-gray-700 transition duration-300"
              >
                <X size={24} />
              </button>
            </div>
            <p className="mt-4">{selectedMessage.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;