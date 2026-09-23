import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { readFileSync } from 'node:fs';

function initFirebaseAdmin() {
  if (getApps().length) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (credPath) {
    const serviceAccount = JSON.parse(readFileSync(credPath, 'utf8'));
    initializeApp({
      credential: cert(serviceAccount),
      projectId: projectId ?? serviceAccount.project_id,
    });
    return;
  }

  initializeApp({
    credential: applicationDefault(),
    projectId,
  });
}

initFirebaseAdmin();

export interface AuthedRequest extends Request {
  uid?: string;
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = header.slice(7);
  try {
    const decoded = await getAuth().verifyIdToken(token);
    req.uid = decoded.uid;
    next();
  } catch {
    res.status(401).json({ error: 'Authentication required' });
  }
}
