import { NextRequest, NextResponse } from 'next/server';
import { getFileById } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const file = await getFileById(id);

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: file.id,
      name: file.name,
      size: file.size,
      mimeType: file.mimeType,
      createdAt: file.createdAt,
    });
  } catch (error) {
    console.error('Error getting file info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
