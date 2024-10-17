import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/db';  // Assuming your Prisma client is in the 'lib/prisma' directory

// TypeScript interface for the request payload
interface RegisterRequestBody {
  username: string;
  url: string;
}

// POST /api/register
export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequestBody = await request.json();

    // Validate the incoming payload
    if (!body.username || !body.url) {
      return NextResponse.json({ error: 'Username and URL are required' }, { status: 400 });
    }

    // Check if the username or url already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Share With your Friends' }, { status: 400 });
    }

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        url: body.url,
      },
    });

    // Return the created user data
    return NextResponse.json({ user: newUser }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
