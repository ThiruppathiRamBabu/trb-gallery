import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PhotoService } from '../photo.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  signupForm!: FormGroup;
  passwordVisible: boolean = false;
  password: string = '';
  constructor(private router: Router, private photoservice: PhotoService, private alt: AlertController, private loadctrl: LoadingController) {
    this.signupForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirm: new FormControl('', Validators.required)
    })
  }
  async onSubmit() {
    const loading = await this.loadctrl.create({
      message: 'Please wait...',
      spinner: 'bubbles',
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
    console.log(this.signupForm.value)
    const userData = Object.assign(this.signupForm.value, { email: this.signupForm.value.email })
    this.photoservice.signIn(userData).then((res: any) => {
      this.router.navigate(['/']);
    }).catch((error: any) => {
      console.log(error);
    })
  }
  async signupWithGoogle() {
    const loading = await this.loadctrl.create({
      message: 'Please wait...',
      spinner: 'bubbles',
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
    console.log('click')
    this.photoservice.signInWithGoogle().then((res: any) => {
      this.router.navigate(['/tabs']);
    }).catch((error: any) => {
      console.log(error);
    })
  }
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

}

