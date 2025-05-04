import { Module } from '@nestjs/common';
import { FirebaseConfig } from './firebase.config';

@Module({
  providers: [FirebaseConfig],
  exports: [FirebaseConfig],
})
export class FirebaseModule {} 