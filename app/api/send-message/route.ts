import { NextResponse } from 'next/server'
import prisma from '../../lib/db'

export async function POST(request: Request) {
  const { id, nickname, message, messageType } = await request.json()

  try {
    const user = await prisma.user.findUnique({
      where: { url: id },
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    const newMessage = await prisma.message.create({
      data: {
        sender: nickname,
        content: message,
        messageType: messageType, // Make sure this line is included
        user: {
          connect: {
            id: user.id
          }
        }
      },
    })

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error('Failed to send message:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}