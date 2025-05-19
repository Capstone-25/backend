import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseConfig {
  constructor() {
    try {
      // private key를 직접 문자열로 처리
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;

      const serviceAccount = {
        type: 'service_account',
        project_id: 'capstone-415ab',
        private_key_id: 'fd5a52f005d38ecb3da9b560b29e43f6d32e17b7',
        private_key: privateKey,
        client_email:
          'firebase-adminsdk-fbsvc@capstone-415ab.iam.gserviceaccount.com',
        client_id: '101129767736475447841',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url:
          'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40capstone-415ab.iam.gserviceaccount.com',
      };

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
