import { NextRequest, NextResponse } from 'next/server';
import { getFileByPin } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin } = body;

    if (!pin || pin.length !== 6) {
      return NextResponse.json({ error: 'Invalid PIN format' }, { status: 400 });
    }

    const file = await getFileByPin(pin);

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Format file size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const fileSize = `${sizeInMB} MB`;

    return NextResponse.json({
      success: true,
      fileId: file.id,
      fileName: file.name,
      fileSize: fileSize,
      fileUrl: `/api/download/${file.id}`,
    });
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
