import { Component } from '@angular/core';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {

  // async takePicture() {
  //   try {
  //     const image = await Camera.getPhoto({
  //       quality: 90,
  //       allowEditing: true,
  //       resultType: CameraResultType.Uri,
  //       source: CameraSource.Camera
  //     });

  //     var imageUrl = image.webPath;
  //     // Handle the captured image or save the URL
  //   } catch (error) {
  //     console.log(error);
  //     // Handle error
  //   }
  // }
 
  // result: HTMLElement | undefined;
  // image = '';
  // constructor(private camera: Camera) { }

  // imageLoaded(e: any) {
  //   // Grab a reference to the canvas/image
  //   this.result = e.detail.result;
  // }

  // captureImage() {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     sourceType: this.camera.PictureSourceType.CAMERA,
  //     correctOrientation: true
  //   }

  //   this.camera.getPicture(options).then((imageData) => {
  //     this.image = 'data:image/jpeg;base64,' + imageData;
  //   });
  // }

  // saveImage() {
  //   if () {
  //     // Use the original image!
  //   } else {
  //     let canvas = this.result as HTMLCanvasElement;
  //     // export as dataUrl or Blob!
  //     let base64 = canvas.toDataURL('image/jpeg', 1.0);
  //     // Do whatever you want with the result!
  //   }
  // }

  
}

