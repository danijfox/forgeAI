
import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  const { name, description } = await req.json();
  const authorization = req.headers.get('Authorization');

  if (!name || !description) {
    return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
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

  const newCollection = {
    name,
    summary: description,
    documentCount: 0,
    documents: [],
    userId: decodedToken.uid,
    createdAt: new Date().toISOString(),
  };

  try {
    const { db: adminDb } = getFirebaseAdmin();
    const docRef = await adminDb.collection('collections').add(newCollection);
    return NextResponse.json({ id: docRef.id, ...newCollection }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}
