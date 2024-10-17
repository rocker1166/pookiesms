import { NextResponse } from 'next/server'
import prisma from '../../lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return new NextResponse('Username is required', { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        messages: {
          orderBy: {
            sentAt: 'desc'
          }
        }
      }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json(user.messages)
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}