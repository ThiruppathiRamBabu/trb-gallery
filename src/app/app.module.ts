import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
// import { IonicImageViewerModule } from 'ionic-img-viewer';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {AngularFireAuthModule} from '@angular/fire/compat/auth'
import { AngularFireModule } from '@angular/fire/compat';



@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,FormsModule,ReactiveFormsModule, AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig) , 
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), 
     provideAuth(() => getAuth()), provideFirestore(() => getFirestore())],
  providers: [PhotoViewer, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
