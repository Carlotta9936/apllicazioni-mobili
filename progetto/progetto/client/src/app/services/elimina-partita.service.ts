import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { AuthService } from './auth.service';
import { BossoloService } from './bossolo.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class EliminaPartitaService {

  constructor(public database: DatabaseService, private router: Router, public auth: AuthService, public bossolo: BossoloService, public alert: AlertService) { }

  //metodo che permette di annullare una partita
  cancelPartita(codice: string):void{
    this.database.eliminaPartita(codice);
    this.bossolo.stopTimer();
    this.router.navigate(['/tabs/tab1']);
  }

  esciPartita(codice: string): void{
    
  }
}
