import { NextResponse } from 'next/server'
import prisma from '../../../lib/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const user = await prisma.user.findUnique({
      where: { url: id },
    })

    if (user) {
      return NextResponse.json({ username: user.username })
    } else {
      return new NextResponse('User not found', { status: 404 })
    }
  } catch (error) {
    console.error('Failed to authenticate:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}