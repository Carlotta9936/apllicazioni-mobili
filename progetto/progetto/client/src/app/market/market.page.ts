import { Component, OnInit } from '@angular/core';
import { Timbro } from '../interfaces/Timbro';
import { ControlloCreditiService } from '../services/controllo-crediti.service';
import { DatabaseService } from '../services/database.service';
import { TimbriService } from '../services/timbri.service';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.page.html',
  styleUrls: ['./market.page.scss'],
})
export class MarketPage implements OnInit {

  crediti: number;
  timbriAcq: Timbro[] = [];

  constructor(public database: DatabaseService, public timbri: TimbriService, public controlloCrediti: ControlloCreditiService, private alert: AlertService, public auth: AuthService) {
    //+ converte in int, ! non è null
    this.crediti = +localStorage.getItem('crediti')!
  }

  ngOnInit() {
    this.getTimbri();
  }

  compraTimbro(idTimbro: number, crediti: number):void{
    //Controllo se l'utente si può permettere il timbro
    if(this.controlloCrediti.autorizzaOperazione(crediti)){
        //Aggiungi timbra a lista timbri
        this.timbri.aggiungiTimbro(this.auth.get("user"), idTimbro)
        //window.alert("Nuovo timbro acquistato");
        window.location.reload();
      } else {
        this.alert.presentAlert("Mi dispiace ma non ti puoi permettere questo timbro");
      }
    }

  compraCrediti(quantita: number): void{
    //Fare transazione con paypal con paypal
    this.controlloCrediti.aggiornaCrediti(quantita*(-1));

  }

  getTimbri(): any{
    this.timbri.nonAppartiene("Alsi").then((value: Timbro[]) => {
      console.log("Value", value);
      this.timbriAcq = value;
      console.log("Timbri", this.timbriAcq);
    });
  }

}
