import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// Create a singleton instance of PrismaClient
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// Generate a random 6-digit PIN - only used in server components/API routes
export function generatePin(): string {
  // No need for client-side branch as this function should only be called server-side
  // This makes the function deterministic during SSR
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Save a file to the database
export async function saveFile(fileName: string, size: number, mimeType: string, url: string) {
  const pin = generatePin();
  
  const file = await prisma.file.create({
    data: {
      id: uuidv4(),
      name: fileName,
      size,
      mimeType,
      pin,
      url,
    },
  });
  
  return file;
}

// Get a file by its ID
export async function getFileById(id: string) {
  return await prisma.file.findUnique({
    where: { id },
  });
}

// Get a file by its PIN
export async function getFileByPin(pin: string) {
  return await prisma.file.findUnique({
    where: { pin },
  });
}

export default prisma;
