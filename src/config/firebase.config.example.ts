import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseConfig {
  constructor() {
    try {
      // private key를 직접 문자열로 처리
      const privateKey = `-----BEGIN PRIVATE KEY-----
여기에 실제 private key를 넣으세요
-----END PRIVATE KEY-----`;

      const serviceAccount = {
        type: 'service_account',
        project_id: 'your-project-id',
        private_key_id: 'your-private-key-id',
        private_key: privateKey,
        client_email:
          'your-service-account-email@your-project.iam.gserviceaccount.com',
        client_id: 'your-client-id',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url:
          'https://www.googleapis.com/robot/v1/metadata/x509/your-service-account-email%40your-project.iam.gserviceaccount.com',
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
