import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseConfig {
  constructor() {
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error('FIREBASE_PRIVATE_KEY is not defined');
    }

    // private key에서 실제 줄바꿈 문자로 변환
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(
      /\\n/g,
      '\n'
    ).replace(/"/g, ''); // 따옴표 제거
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    } catch (error) {
      console.error('Firebase 초기화 실패:', error);
      throw error;
    }
  }
}
