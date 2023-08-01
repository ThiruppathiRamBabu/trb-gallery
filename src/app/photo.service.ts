import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collectionData, doc, docData, getDoc } from '@angular/fire/firestore';
import { GoogleAuthProvider, User, getAuth } from 'firebase/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable, firstValueFrom, from, switchMap } from 'rxjs';
import { addDoc, collection, deleteDoc, query, updateDoc, where } from 'firebase/firestore';
import { authState } from '@angular/fire/auth';
// import {AngularFirestore, AngularFirestoreCollection,} from '@angular/fire/compat/firestore';


export interface FilesUploadMetadata {
  uploadProgress$: Observable<number | undefined>;
  downloadUrl$: Observable<string | undefined>;
}

@Injectable({
  providedIn: 'root'
})

export class PhotoService {
  private _currentUser: any;
  authentication: any = getAuth();

  constructor(private firestore: Firestore, public auth: AngularFireAuth, private angularFireStorage: AngularFireStorage) { }
  get(path: any) {
    console.log('service');
    const image = collection(this.firestore, path);
    return collectionData(image, { idField: 'Id' })
  }
  getCollectionByQuery(path: any, fieldName: string, operation: any, value: string) {
    const q = query(collection(this.firestore, path), where(fieldName, operation, value));
    return collectionData(q, { idField: 'Id' });
  }
  async add(path: any, data: any) {
    const collectionRef = collection(this.firestore, path);
    return await addDoc(collectionRef, data);
  }
  delete(path: any) {
    const docRef = doc(this.firestore, path);
    return deleteDoc(docRef);
  }

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

  uploadFileAndGetMetadata(
    mediaFolderPath: string,
    fileToUpload: File,
  ): FilesUploadMetadata {
    const { name } = fileToUpload;
    const filePath = mediaFolderPath + '/' + Math.random();
    const uploadTask: AngularFireUploadTask = this.angularFireStorage.upload(
      filePath,
      fileToUpload
    );
    return {
      uploadProgress$: uploadTask.percentageChanges(),
      downloadUrl$: this.getDownloadUrl$(uploadTask, filePath),
    };
  }

  getDownloadUrl$(
    uploadTask: AngularFireUploadTask,
    path: string,
  ): Observable<string> {
    return from(uploadTask).pipe(
      switchMap((_) => this.angularFireStorage.ref(path).getDownloadURL()),
    );
  }
  loginUsers() {
    return new Promise<User | null>(async (resolve, reject) => {
      try {
        if (this._currentUser) {
          resolve(this._currentUser);
        } else {
          this._currentUser = await firstValueFrom(authState(this.authentication));
          resolve(this._currentUser);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  signOut() {
    return this.auth.signOut().then((val: any) => {
    });
  }
}
