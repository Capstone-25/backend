import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseConfig {
  constructor() {
    try {
      // private key를 직접 문자열로 처리
      const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2n4HcApQ+G9G/
61qtKjGrVdoi9dq2cJ2uiV9o4xEZFXW2ZgYAsFFLqldyH7XQ0WB3EDHNnsViLjIW
vOW2fxY5/2z7IqHijTQpRV8L6ZyBswuctmPSn53ZqccKCQlt8AypvZvoZWvppBJo
y4U8YThVK+IbqwRsa1DUpE8RnAcjEcDwhnQGpftTKwAoByk4w511NYiAyRxAbKXb
ySUQqkiSLiiZDB6lO479mtdIbz3jXt4x7sRBtgCfLJx3TusDoT95DlRb1DnnzrRt
iNmYDG5835QP8l3zOUFetk/0VPnPrptZhIcomYwbQlg3byhfWF+/bpHL1CUKg239
CNXzEXS7AgMBAAECggEABVMc71lt5r+wkRbKI966kwMjoz2lh7M8jbsN+poVmgnL
pFVQ2yfzlDAJG608A7TPH2RBUib3x1c5zlA/UbUJOgiuA0aCZNTMJAs/QbLT2t4/
D5iBIZeA0TiyMniKpgIdRGe1tNlxg4mX9dE/9xTjQRcl9mY5RfX9EIN362IFZ+rP
GczYrxJY01TtAE0QpmLNBBpefjGMLrbnYnEMS7G1hgY8IhLWAmhqhY6RbmwWktQ9
vGn00fsqT8QqFDlBkbXNkN63lJql0vFLPkuJhnGFdUEIwalpRBh2Q6rjiDbfFtzo
7lIOBQs6a2+f22ZAz90/FXi9B2oATXVZPOGXgxpP1QKBgQDtvCXc9C5t4g4sLJ0X
uc6YanydIk2A4j0H3NcR2hmlrzDROr0+mg0PY/+LaX+MabaO4Ec1815M41v0NweV
a0M66Ih4+ZJSJgEMhtMnoFZmpdjdbkvjsAZzkJffyXX++u9meAOhfJ1wrZ3vnxHT
EHgpCN2T9nxziJnWN3NnpKtAXwKBgQDEp2ZxQhFjuuAu2jPWk6PjzqDnL2iCkfR6
KA/f5DF8fpZAFS9yiGOsPSzy6gI/w/4cXbshFO/mm57ALiW8IjhhDLj5au9jOS4G
RfMDC9K2y0hE+Upypb/rJnQcBMTFDd04x6YNKIYr0WbJUglNyjZjOt28Uo7+xUfW
wMLcrIQ5JQKBgBqRWDnlH/svtB3DrpqkLS5jWCHHX5nzrpZeW7qnAQ6/EVmQku2Y
EbWSm1BdLd/nQHufHNYuqG83SWN1cueD4TOIIRhD69I6ZQudVaOsC3vVNPMqDFkZ
pt7rXc2omgMwz+hHqUA2yPF6tZe90yQfRw5u6zRJ64aN0YNbFw6SHIFJAoGBAJDj
vaiowuM15sLeZd8s/E12CjsLRPcezn/KUJfnK0bMhatFcKX0M2vNzvZSz8FniCwi
KyOep3rDId36ojbRB7UJiKfL0ADNOknI89lEtsWTVPXsrpt138dDl7ylDs0Y/+s7
ve5n8yMJr6+Yz94OpK/LyV9dfJndhKaHc4rfWLQ5AoGAVmh12OvE0yXSaGfQ+/05
ux0PejYsEMigkNXnvCxQEgnzbPYjUkie2/60dq+BnomxcRnpCNC84x24dSR5ceJk
DyLUdStQkx9GOpqTLYdITyUuvsUlWR11edlMv7E6DFWq9Anj/I4Asz0E7RnA990m
fDrZAkGbinhLr1cmCARDzbg=
-----END PRIVATE KEY-----`;

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
