import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer } from '@angular/platform-browser';
import {PhotoViewer} from '@awesome-cordova-plugins/photo-viewer/ngx';
import { } from '@capacitor-community/photoviewer';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  imageUrl:any;
  imageGallery: any[] = [];
  isDarkMode: boolean = false;
  constructor(private DomSanitizer: DomSanitizer, private photoViewer : PhotoViewer) {
    const getImage: any = localStorage.getItem('imageUrl');
    const storeImage = JSON.parse(getImage);
    console.log('storeimage')
    if (storeImage) {
      storeImage.forEach((val: any) => this.imageGallery.push(val));
    }
  }
  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      saveToGallery: true,
    });
    this.imageUrl = image.dataUrl;
    console.log(this.imageUrl);
    // this.imageGallery.push(imageUrl);
    let data = localStorage.getItem('imageUrl');
    if (data) {
      this.imageGallery = this.imageGallery.concat(image.dataUrl);
    }
    else {
      this.imageGallery.push(image.dataUrl);
    }
    localStorage.setItem('imageUrl', JSON.stringify(this.imageGallery));
    console.log('image', this.imageGallery);
    // var imageUrl = image.webPath;
  }
  showPhotoViewer(imageUrl: any){
    const options:any = {
      sharp : true,
      closeButton: true,
      copyToReference:true,
      headers: '',
      piccasoOptions:{}

    }
    this.photoViewer.show(imageUrl, options);
  }
  dark() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark', this.isDarkMode);
  }

}
