import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import { PhotoService } from '../photo.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class Tab3Page {

  isDarkMode: boolean = false;

  constructor(private router: Router, private ps: PhotoService) { }
  dark() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
  }
  logout() {
    this.ps.signOut().then((res: any) => {
      this.router.navigate(['/login']);
      window.location.reload();
    })
  }
}
