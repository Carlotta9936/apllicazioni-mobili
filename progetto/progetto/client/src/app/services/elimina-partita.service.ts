import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { AuthService } from './auth.service';
import { BossoloService } from './bossolo.service';

@Injectable({
  providedIn: 'root'
})
export class EliminaPartitaService {

  constructor(public database: DatabaseService, private router: Router, public auth: AuthService, public bossolo: BossoloService) { }

  //metodo che permette di annullare una partita
  cancelPartita(codice: string):void{
    //this.socket.esci(codice,(this.auth.get("user")),true); //true indica che sono il proprietario
    this.database.eliminaPartita(codice);
    //this.socket.stopRead();
    this.bossolo.stopTimer();
    this.router.navigate(['/tabs/tab1']);
  }

  esciPartita(codice: string): void{
    
  }
}
