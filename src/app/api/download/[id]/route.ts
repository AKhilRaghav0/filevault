import { NextRequest, NextResponse } from 'next/server';
import { getFileById } from '@/lib/db';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

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

    // Get the absolute path to the file
    const filePath = path.join(process.cwd(), 'public', file.url);

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
    }

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Create response with file data
    const response = new NextResponse(fileBuffer);
    
    // Set appropriate headers
    response.headers.set('Content-Disposition', `attachment; filename="${file.name}"`);
    response.headers.set('Content-Type', file.mimeType);
    response.headers.set('Content-Length', file.size.toString());

    return response;
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}