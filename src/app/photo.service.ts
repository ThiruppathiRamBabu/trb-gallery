import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore} from '@angular/fire/firestore';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private firestore: Firestore, public auth: AngularFireAuth) { }
  // get(){
  //   console.log('service');
  //   const data = collection(this.firestore, '');
  //   return collectionData(data);
  // }
  signIn(user: { email: string, password: string }) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password);
  }
  login(user: { email: string, password: string }) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }
  forgetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }
  signInWithGoogle() {
    return this.auth.signInWithPopup(new GoogleAuthProvider());
  }
}
