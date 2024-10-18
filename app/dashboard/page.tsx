"use client";

import React, { useState, useEffect } from "react";
import { Clipboard, X, Zap, Sparkles, MessageCircle, Trash2, Menu } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: string;
  content: string;
  sentAt: string;
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-white">PookieSMS</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800">Dashboard</Link>
            <Link href="/profile" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800">Profile</Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sm:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900">
              <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Dashboard</Link>
              <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Profile</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 shadow-md mt-auto">
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <p className="text-center text-gray-500 text-sm">
        © 2023 PookieSMS. All rights reserved.
      </p>
    </div>
  </footer>
  );
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [copied, setCopied] = useState(false);
  const [uniqueLink, setUniqueLink] = useState("");
  const [url, setUrl] = useState("");
  const { user } = useUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedLink = localStorage.getItem("uniqueLink");
    if (storedLink) {
      setUniqueLink(storedLink);
      const generatedId = storedLink.split("/").pop();
      setUrl(generatedId || "");
    } else {
      const newId = nanoid();
      const newLink = `${window.location.origin}/sms/${newId}`;
      setUniqueLink(newLink);
      setUrl(newId);
      localStorage.setItem("uniqueLink", newLink);
    }
  }, []);

  useEffect(() => {
    const registerUser = async () => {
      if (!user?.username || !uniqueLink) return;
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user.username, url: url }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.error || "Error registering user");
        } else {
          setErrorMessage(null);
        }
      } catch (error) {
        console.error("Error registering user:", error);
        setErrorMessage("An unexpected error occurred");
      }
    };
    registerUser();
  }, [uniqueLink, user?.username, url]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.username) return;
      try {
        const response = await fetch(`/api/getMessages?username=${encodeURIComponent(user.username)}`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data: Message[] = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setErrorMessage("Failed to load messages");
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
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateContent = (content: string, maxLength = 50) => {
    return content.length > maxLength ? content.substring(0, maxLength) + "..." : content;
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center text-white"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to Your Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="md:col-span-2"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-300">
              <MessageCircle className="mr-2" /> Message Inbox
            </h2>
            <div className="bg-gray-700 shadow-md rounded-lg p-4">
              <AnimatePresence>
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      className="border-b border-gray-600 py-3 cursor-pointer hover:bg-gray-600 transition duration-300 rounded-md mb-2"
                      onClick={() => setSelectedMessage(message)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-200">{message.sender}</h3>
                        <span className="text-xs text-gray-400">{formatDate(message.sentAt)}</span>
                      </div>
                      <p className="text-sm text-gray-300">{truncateContent(message.content)}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400">No messages yet.</p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div 
            className="md:col-span-1"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-300">
              <Zap className="mr-2" /> Your Unique Link
            </h2>
            <div className="bg-gray-700 shadow-md rounded-lg p-4 text-center">
              <p className="text-gray-200 break-all">{uniqueLink}</p>
              <button
                onClick={handleCopy}
                className={`mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ${copied ? "bg-green-600 hover:bg-green-700" : ""}`}
              >
                {copied ? <Sparkles className="mr-2" /> : <Clipboard className="mr-2" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </motion.div>
        </div>

        {selectedMessage && (
          <AnimatePresence>
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
              onClick={() => setSelectedMessage(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full mx-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-100">{selectedMessage.sender}</h2>
                  <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-gray-200 transition duration-300">
                    <X />
                  </button>
                </div>
                <p className="text-gray-300 mb-4">{selectedMessage.content}</p>
                <div className="text-xs text-gray-500 text-right">{formatDate(selectedMessage.sentAt)}</div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
                  >
                    <Trash2 className="mr-2" /> Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

      </div>
      <Footer />
    </div>
  );
}
