import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PhotoService } from '../photo.service';
import { NgFor } from '@angular/common';
import { Swiper } from 'swiper/types';

// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss'],
    standalone: true,
    imports: [IonicModule, NgFor],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Tab2Page {
    @ViewChild('swiper')
    sweiperRef: ElementRef | undefined;
    swiper?: Swiper;
    userRef: any;
    imageGallery: any[] = [];
    isModalOpen = false;
    isAnotherModalOpen = false;
    selectedThumbnail: any;
    selectedImageUrl!: string;
    imageUrl: any;
    selectedImageIndex: number = 0;
    constructor(private ps: PhotoService) {
        const user = localStorage.getItem('loginData');
        if (user) {
            this.userRef = 'users/' + (JSON.parse(user))[0].Id;
            console.log(this.userRef);
            this.ps.get(`${this.userRef}/images`).subscribe((res: any[]) => {
                this.imageGallery = res.sort((a, b) => new Date(a.captureDate).getTime() - new Date(b.captureDate).getTime());
                console.log('db', res);
                const lastIndex = this.imageGallery.length - 1;
                if (lastIndex >= 0) {
                    this.selectedThumbnail = this.imageGallery[lastIndex].imgUrl;
                    console.log('thumb', this.selectedThumbnail);
                }
            });
        } else {
            const user = localStorage.getItem('userRef');
            if (user) {
                this.userRef = JSON.parse(user);
                this.ps.get(`${this.userRef}/images`).subscribe((res: any[]) => {
                    this.imageGallery = res.sort((a, b) => new Date(a.captureDate).getTime() - new Date(b.captureDate).getTime());
                    console.log('db67', res);
                });
            }
        }

    }

    openModal() {
        this.isModalOpen = true;
    }
    setOpen(isOpen: boolean) {
        this.isModalOpen = isOpen;
    }
    openFullscreenView(imageUrl: string) {
        this.selectedImageUrl = imageUrl;
        this.isModalOpen = false;
        this.isAnotherModalOpen = true;
    }
    closeAnotherModal() {
        this.isAnotherModalOpen = false;
        this.isModalOpen = true;
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

}

