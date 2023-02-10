import { Component, OnInit } from '@angular/core';
import { Timbro } from '../interfaces/Timbro';
import { ControlloCreditiService } from '../services/controllo-crediti.service';
import { DatabaseService } from '../services/database.service';
import { TimbriService } from '../services/timbri.service';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { rejects } from 'assert';

@Component({
  selector: 'app-market',
  templateUrl: './market.page.html',
  styleUrls: ['./market.page.scss'],
})
export class MarketPage implements OnInit {

  risp?: any;
  crediti: number;
  timbriAcq: Timbro[] = [];

  constructor(public database: DatabaseService, public timbri: TimbriService, public controlloCrediti: ControlloCreditiService, 
    private alert: AlertService, public auth: AuthService) {
    //+ converte in int, ! non è null
    this.crediti = Number(this.auth.get('crediti'));
  }

  ngOnInit() {
    this.getTimbri();
  }

  compraTimbro(idTimbro: number, crediti: number):void{
    //Controllo se l'utente si può permettere il timbro
    if(this.controlloCrediti.autorizzaOperazione(crediti)){
        //Aggiungi timbro a lista timbri
        this.timbri.aggiungiTimbro(this.auth.get("user"), idTimbro)
        window.location.reload();
      } else {
        this.alert.presentAlert("Mi dispiace ma non ti puoi permettere questo timbro");
      }
    }

  async compraCrediti(quantita: number):Promise<void>{
    //Fare transazione con paypal con paypal
    //essendo una transizione di soldi quindi più delicata chiedo la conferma
    let risposta= this.alert.alertConferma(this.risp);
    console.log("risposta", (await risposta).valueOf());
    if(await (await risposta).valueOf()==true){
      this.controlloCrediti.aggiornaCrediti(quantita*(-1));
      window.location.reload();
    }
  }

  //metodo per stampare i timbri che l'utente non possiede
  getTimbri(): any{
    this.timbri.nonAppartiene(this.auth.get("user")!).then((value: Timbro[]) => {
      console.log("Value", value);
      this.timbriAcq = value;
      console.log("Timbri", this.timbriAcq);
    });
  }

}
