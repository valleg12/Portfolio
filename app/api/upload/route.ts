import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Vérifier que nous avons bien le corps de la requête
    const body = request.body;
    if (!body) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Ajouter un log pour déboguer
    console.log('Attempting to upload:', filename);

    const blob = await put(filename, body, {
      access: 'public',
      addRandomSuffix: true // Ajouter un suffixe aléatoire pour éviter les conflits de noms
    });

    console.log('Upload successful:', blob);
    return NextResponse.json(blob);
  } catch (error) {
    // Log l'erreur complète
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
} 