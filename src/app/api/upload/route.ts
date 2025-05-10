import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { saveFile } from '@/lib/db';

// Set the maximum file size (100MB)
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '100mb',
  },
};

export async function POST(request: NextRequest) {
  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Get file details
    const fileName = file.name;
    const fileSize = file.size;
    const mimeType = file.type;
    const uniqueId = uuidv4();

    // Create a unique file path
    const filePath = path.join(uploadDir, `${uniqueId}-${fileName}`);
    const fileRelativePath = `/uploads/${uniqueId}-${fileName}`;

    // Convert to buffer for saving
    const fileBuffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(fileBuffer));

    // Save file details to database with generated PIN
    const fileData = await saveFile(fileName, fileSize, mimeType, fileRelativePath);

    return NextResponse.json({
      success: true,
      id: fileData.id,
      pin: fileData.pin,
      name: fileData.name,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ 
      error: 'Internal server error during file upload' 
    }, { status: 500 });
  }
}