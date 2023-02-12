import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ControlloCreditiService } from './controllo-crediti.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController, public controlloCrediti: ControlloCreditiService) { }

  //alert normale
  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Important message',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

  //alert che richiede una scelta
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

  //alert per acquisto scheda aggiuntiva nel pre-partia in mancanza di crediti
  async alertCompraCrediti(): Promise<boolean>{
    let risposta: boolean = false;
    const alert = await this.alertController.create({
      header: 'Non hai crediti a sufficienza, vuoi comprare 10 crediti al volo?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            risposta = false;
          },
        },
        {
          text: 'Sì',
          role: 'confirm',
          handler: () => {
            this.controlloCrediti.aggiornaCrediti(-10);
            risposta = true;
          },
        },
      ],
    });
    await alert.present();
    await alert.onDidDismiss();
    return risposta;
  }
}
