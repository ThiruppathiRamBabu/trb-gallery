import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { PhotoService } from '../photo.service';
import { firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [PhotoService],
})
export class LoginPage {
  loginForm!: FormGroup;
  passwordVisible: boolean = false;
  password: string = '';
  constructor(private router: Router, private ps: PhotoService, private alt: AlertController, private loadctrl: LoadingController) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    })
    // this.reset();
  }
  async onSubmit() {
    const userData = Object.assign(this.loginForm.value, { email: this.loginForm.value.email })
    this.ps.login(userData).then(async (res: any) => {
      console.log('login',res);
     const data =  await firstValueFrom(this.ps.getCollectionByQuery('users','email','==', res.user._delegate.providerData[0].email).pipe(take(1)));
     localStorage.setItem('loginData',JSON.stringify(data));
      this.router.navigate(['/tabs']);
    }, async error => {
      const alert = await this.alt.create({
        message: 'Invalid email and password',
        buttons: [{ text: 'Ok', role: 'cancel' }],
      });
      await alert.present();
    });
  }

  // reset(){
  //   this.loginForm.reset({
  //     email: '',
  //     password: ''
  //   })
  // }


  async loginWithGoogle() {
    const loading = await this.loadctrl.create({
      message: 'Please wait...',
      spinner: 'bubbles',
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
    console.log('click')
    this.ps.signInWithGoogle().then(async(res: any) => {
      const data = await firstValueFrom(this.ps.getCollectionByQuery('users','email','==',res.user._delegate.providerData[0].email).pipe(take(1)));
      localStorage.setItem('loginData',JSON.stringify(data));
      this.router.navigate(['/tabs']);
    }).catch((error: any) => {
      console.log(error);
    })
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
