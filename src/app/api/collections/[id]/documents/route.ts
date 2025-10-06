
import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { id: collectionId } = params;
  const { name, type, size, downloadUrl } = await req.json();
  const authorization = req.headers.get('Authorization');

  if (!authorization) {
    return NextResponse.json({ error: 'Authorization header is required' }, { status: 401 });
  }

  if (!name || !type || !size || !downloadUrl) {
    return NextResponse.json({ error: 'Missing required file metadata' }, { status: 400 });
  }

  try {
    const { auth: adminAuth, db: adminDb } = getFirebaseAdmin(); // Lazy initialization

    const token = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const { uid } = decodedToken;

    // Security Check: Verify that the user owns the collection
    const collectionRef = adminDb.collection('collections').doc(collectionId);
    const collectionDoc = await collectionRef.get();

    if (!collectionDoc.exists || collectionDoc.data()?.userId !== uid) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create the new document in the sub-collection
    const newDocRef = await collectionRef.collection('documents').add({
      name,
      type,
      size,
      downloadUrl,
      uploadedAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: newDocRef.id }, { status: 201 });

  } catch (error) {
    console.error('Error creating document:', error);
    // Check if the error is a Firebase Auth error code
    if (typeof error === 'object' && error !== null && 'code' in error && (error as {code: string}).code === 'auth/id-token-expired') {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
