import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async alertConferma(risposta: any):Promise<boolean> {

    const alert = await this.alertController.create({
      header: 'Sicuro di voler comprare nuovi crediti?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            risposta= false;
          },
        },
        {
          text: 'Sì',
          role: 'confirm',
          handler: () => {
            risposta= true;
          },
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
    return risposta;
  }
}
