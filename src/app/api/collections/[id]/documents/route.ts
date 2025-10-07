
import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

interface RouteParams {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const { id: collectionId } = params;
  const body = await req.json();
  const { name, type, size, downloadUrl } = body;
  const authorization = req.headers.get('Authorization');

  if (!name || !type || !size || !downloadUrl) {
    return NextResponse.json({ error: 'Missing required file metadata' }, { status: 400 });
  }

  if (!authorization) {
    return NextResponse.json({ error: 'Authorization header is required' }, { status: 401 });
  }

  const token = authorization.split('Bearer ')[1];
  let decodedToken;
  try {
    const { auth: adminAuth } = getFirebaseAdmin();
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const newDocument = {
    name,
    type,
    size,
    downloadUrl,
    userId: decodedToken.uid,
    collectionId: collectionId,
    uploadedAt: new Date().toISOString(),
    status: 'uploaded', // Initial status
  };

  try {
    const { db: adminDb } = getFirebaseAdmin();
    const docRef = await adminDb.collection('collections').doc(collectionId).collection('documents').add(newDocument);
    return NextResponse.json({ id: docRef.id, ...newDocument }, { status: 201 });
  } catch (error) {
    console.error('Failed to create document in Firestore:', error);
    return NextResponse.json({ error: 'Failed to create document entry' }, { status: 500 });
  }
}
