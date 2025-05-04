import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from './firebase-service-account.json';

@Injectable()
export class FirebaseConfig {
  constructor() {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount
        ),
      });
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Firebase 초기화 실패:', error);
      throw error;
    }
  }
}
