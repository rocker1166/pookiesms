'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Send, User, MessageSquare, ArrowLeft, Tag, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const suggestionData = {
  dare: [
    { title: "Truth or Dare", description: "I dare you to post a funny selfie on your social media!" },
    { title: "Challenge Accepted", description: "I dare you to learn a TikTok dance and post it!" },
    { title: "Brave Soul", description: "I dare you to eat a spoonful of hot sauce!" },
    { title: "Adventure Time", description: "I dare you to go a whole day speaking in a fake accent!" },
  ],
  confession: [
    { title: "Secret Crush", description: "I've had a crush on you since we first met..." },
    { title: "Hidden Talent", description: "I can actually juggle five balls at once!" },
    { title: "Guilty Pleasure", description: "I secretly love watching cheesy romantic comedies." },
    { title: "Childhood Memory", description: "I once ate an entire cake meant for my sister's birthday." },
  ],
  fun: [
    { title: "Joke Time", description: "Why don't scientists trust atoms? Because they make up everything!" },
    { title: "Fun Fact", description: "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible!" },
    { title: "Riddle Me This", description: "I'm tall when I'm young, and I'm short when I'm old. What am I?" },
    { title: "Would You Rather", description: "Would you rather be able to fly or be invisible?" },
  ],
  request: [
    { title: "Favor", description: "Could you help me with my math homework sometime?" },
    { title: "Invitation", description: "Want to grab coffee and catch up this weekend?" },
    { title: "Recommendation", description: "Can you suggest a good book to read?" },
    { title: "Collaboration", description: "I'm starting a band, want to join?" },
  ],
  other: [
    { title: "Random Thought", description: "I wonder if clouds ever look down on us and say, 'Hey, that one is shaped like a person!'" },
    { title: "Appreciation", description: "I just wanted to say that you're awesome!" },
    { title: "Question", description: "If you could have dinner with any historical figure, who would it be and why?" },
    { title: "Observation", description: "Have you ever noticed how squirrels always look like they're plotting something?" },
  ],
}

function SuggestionCard({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <Card 
      className="bg-gray-800 border-gray-700 cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:border-indigo-500"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <CardHeader>
        <CardTitle className="text-indigo-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-300">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

export default function SMSPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [nickname, setNickname] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<keyof typeof suggestionData>('other')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState(false)
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch(`/api/auth/${id}`)
      if (res.ok) {
        const data = await res.json()
        setAuthenticated(true)
        setUsername(data.username)
      } else {
        setError('User not found')
      }
    }
    checkAuth()
  }, [id])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage(false)
    const res = await fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, nickname, message, messageType }),
    })
    if (res.ok) {
      setMessage('')
      setNickname('')
      setMessageType('other')
      setSuccessMessage(true)
      setTimeout(() => setSuccessMessage(false), 2000) // Hide after 2 seconds
    } else {
      setError('Failed to send message')
    }
  }

  const handleSuggestionClick = (description: string) => {
    setMessage(description)
  }

  if (error) return (
    <Alert variant="destructive" className="m-4">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )

  if (!authenticated) return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-white text-xl font-semibold"
      >
        Authenticating...
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-6 space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">Send message to: {username}!</h1>
            <p className="mb-6 text-center text-gray-400">Send an anonymous message below:</p>
            <form onSubmit={sendMessage} className="space-y-6">
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="inline-block mr-2 h-4 w-4" />
                  Nickname
                </label>
                <Input
                  type="text"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="messageType" className="block text-sm font-medium text-gray-300 mb-2">
                  <Tag className="inline-block mr-2 h-4 w-4" />
                  Message Type
                </label>
                <Select 
  value={messageType} 
  onValueChange={(value: string) => setMessageType(value as keyof typeof suggestionData)}>

                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500">
                    <SelectValue placeholder="Select a message type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dare">Dare</SelectItem>
                    <SelectItem value="confession">Confession</SelectItem>
                    <SelectItem value="fun">Fun</SelectItem>
                    <SelectItem value="request">Request</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  <MessageSquare className="inline-block mr-2 h-4 w-4" />
                  Message
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-2 rounded-lg flex items-center justify-center">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              {successMessage && (
               <Alert variant="default" className="m-4 bg-green-500 text-white">

                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <AlertDescription>Your message has been sent successfully!</AlertDescription>
                </Alert>
              )}
            </form>
          </div>

          <div className="md:w-1/2 space-y-6">
            <h2 className="text-2xl font-bold text-indigo-400">Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestionData[messageType].map((suggestion, index) => (
                <SuggestionCard
                  key={index}
                  title={suggestion.title}
                  description={suggestion.description}
                  onClick={() => handleSuggestionClick(suggestion.description)}
                />
              ))}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600 focus:ring-indigo-500"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </motion.div>
    </div>
  )
}
