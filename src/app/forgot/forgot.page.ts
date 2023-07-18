import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../photo.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage  {
email:string = '';
  constructor(private photoservice : PhotoService, private router: Router, private alt: AlertController, private loadctrl : LoadingController) { }

  async forgot(email: string){
    const loading = await this.loadctrl.create({
      message: 'Please wait...',
      spinner: 'bubbles',
      duration: 2000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
    console.log('email', email)
    this.photoservice.forgetPassword(email).then(
      async () => {
        const alert = await this.alt.create({
          message: 'Check your email for a password reset link',
          buttons: [
            {
              text: 'Ok',
              role: 'cancel',
              handler: () => {
                this.router.navigateByUrl('/');
              },
            },
          ],
        });
        await alert.present();
      },
      async error => {
        const errorAlert = await this.alt.create({
          message: error.message,
          buttons: [{ text: 'Ok', role: 'cancel' }],
        });
        await errorAlert.present();
      }
    );
  }
  }


