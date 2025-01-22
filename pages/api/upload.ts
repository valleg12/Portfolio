import { put } from '@vercel/blob';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const blob = await put(request.query.filename as string, request, {
    access: 'public',
  });

  return response.json(blob);
} 