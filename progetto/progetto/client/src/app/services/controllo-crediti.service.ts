import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class ControlloCreditiService {

  constructor(public database: DatabaseService, public Auth: AuthService) { }

  //Recupera i crediti di un utente
  prendiCrediti(){
    console.log("crediti"+localStorage.getItem('crediti'));
    return +this.Auth.get("crediti");
  }


  //controllo per autorizzare la transazione
  autorizzaOperazione(prezzo: number): boolean{
    //Controllo se l'utente si può permettere l'operazione
    if(this.prendiCrediti()>=prezzo){
      this.aggiornaCrediti(prezzo);
      return true;
    } else {
      return false;
    }
  }

  aggiornaCrediti(val: number): void{
    let newCrediti = this.prendiCrediti() - val
    //Aggiornare DB
    this.database.aggiornaCrediti(this.Auth.get("user"), newCrediti);
    //Aggiornare local data
    this.Auth.set("crediti", ""+newCrediti);
    //localStorage.setItem("crediti", ""+newCrediti);
  }


}
