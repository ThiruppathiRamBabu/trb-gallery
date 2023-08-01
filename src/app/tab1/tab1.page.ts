import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer } from '@angular/platform-browser';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { JsonPipe, NgFor } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { firstValueFrom, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PhotoService } from '../photo.service';
import { Swiper } from 'swiper/types';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, NgFor],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab1Page {
  @ViewChild('swiper')
  sweiperRef: ElementRef | undefined;
  swiper?: Swiper;
  imageUrl: any;
  imageGallery: any[] = [];
  isDarkMode: boolean = false;
  userRef: any;
  isModalOpen = false;
  selectedImageUrl!: string;
  showFlag: boolean = false;
  selectedImageIndex: number = 0;
  currentIndex!: number;
  groupedImageGallery: { captureDate: string, images: any[] }[] = [];
  constructor(private DomSanitizer: DomSanitizer, private http: HttpClient, private ps: PhotoService) {
    
    const user = localStorage.getItem('loginData');
    if (user) {
      this.userRef = 'users/' + (JSON.parse(user))[0].Id;
      console.log(this.userRef);
      this.ps.get(`${this.userRef}/images`).subscribe((res: any[]) => {
        this.imageGallery = res.sort((a, b) => new Date(a.captureDate).getTime() - new Date(b.captureDate).getTime());
        console.log('db', res);
        this.groupedImageGallery = this.groupImagesByDate(this.imageGallery);
      });
    } else {
      const user = localStorage.getItem('userRef');
      if (user) {
        this.userRef = JSON.parse(user);
        this.ps.get(`${this.userRef}/images`).subscribe((res: any[]) => {
          this.imageGallery = res.sort((a, b) => new Date(a.captureDate).getTime() - new Date(b.captureDate).getTime());
          console.log('db67', res);
          this.groupedImageGallery = this.groupImagesByDate(this.imageGallery);
        });
      }
    }
    console.log('ref', this.userRef);
  }
  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      saveToGallery: true,
    });
    this.imageUrl = image.webPath;
    console.log(this.imageUrl);

    const captureDate = new Date().toString();
    // this.imageGallery.push(imageUrl);
    const blob = await firstValueFrom(this.http.get(this.imageUrl, { responseType: 'blob' }).pipe(take(1)));
    const file = new File([blob], 'img.png', { type: blob.type });
    //signup
    const resp: any = this.ps.uploadFileAndGetMetadata(`${this.userRef}/images`, file);
    console.log(await firstValueFrom(resp.downloadUrl$));
    const fsDownloadUrl = await firstValueFrom(resp.downloadUrl$);
    console.log('download', fsDownloadUrl);
    await this.ps.add(`${this.userRef}/images`, { imgUrl: fsDownloadUrl, captureDate });
  }
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  openFullscreenView(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
    console.log('selecting', this.selectedImageUrl);
    localStorage.setItem('del', JSON.stringify(this.selectedImageUrl));
    this.setOpen(true);
  }
  async delete(isOpen: boolean) {
    const remove = localStorage.getItem('del');
    if (remove) {
      const deleteData = JSON.parse(remove);
      console.log('remove', deleteData);
      const data: any = await firstValueFrom(this.ps.getCollectionByQuery(`${this.userRef}/images`, 'imgUrl', '==', deleteData).pipe(take(1)));
      console.log('data', data);
      this.ps.delete(`${this.userRef}/images/${data[0].Id}`);
    }
    this.isModalOpen = isOpen;
  }
  swiperSlideChanged(e: any) {
    this.selectedImageUrl;
    this.selectedImageIndex = this.imageGallery.findIndex((image) => image.imgUrl === this.selectedImageUrl);
    console.log(e);
    console.log('changed', this.selectedImageIndex);
    if (this.imageGallery.length > this.selectedImageIndex + 1) {
      this.selectedImageUrl = this.imageGallery[this.selectedImageIndex + 1].imgUrl;
      this.swiper?.slideNext();
    }
     else if (this.selectedImageIndex > 0) {
      this.selectedImageUrl = this.imageGallery[this.selectedImageIndex - 1].imageUrl;
      this.swiper?.slidePrev();
    }
    console.log(this.selectedImageUrl);
  }
  swiperReady() {
    this.swiper = this.sweiperRef?.nativeElement.swiper;
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  }
  private groupImagesByDate(images: any[]): { captureDate: string, images: any[] }[] {
    const grouped: { [key: string]: any[] } = {};

    for (const image of images) {
      const captureDate = this.formatDate(image.captureDate);
      if (!grouped[captureDate]) {
        grouped[captureDate] = [];
      }
      grouped[captureDate].push(image);
    }

    return Object.keys(grouped).map(captureDate => ({
      captureDate,
      images: grouped[captureDate]
    }));
  }
}
