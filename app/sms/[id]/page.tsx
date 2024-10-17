'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function SMSPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [nickname, setNickname] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const params = useParams()
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
    const res = await fetch('/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, nickname, message }),
    })
    if (res.ok) {
      setMessage('')
      setNickname('')
      // Optionally, you could fetch and display sent messages here
    } else {
      setError('Failed to send message')
    }
  }

  if (error) return <div className="p-4 text-red-500">{error}</div>

  if (!authenticated) return <div className="p-4">Authenticating...</div>

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>
      <p className="mb-4">Send a message below:</p>
      <form onSubmit={sendMessage} className="space-y-4">
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
            Nickname
          </label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}