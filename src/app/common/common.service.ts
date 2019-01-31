import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private loadingController: LoadingController) { }

  async showLoader(msg) {
    const loading = await this.loadingController.create({
      message: msg,
      translucent: true,
    });
    return await loading.present();
  }

  async dismissLoader() {
    return await this.loadingController.dismiss();
  }
}
