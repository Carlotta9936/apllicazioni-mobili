import { Injectable } from '@angular/core';
import { getDatabase, set, ref, onValue, remove, update, child, get, push} from "firebase/database";
import { Observable, Subscription } from 'rxjs';
import { Partita } from '../interfaces/Partita';
import { PartitaData } from '../interfaces/PartitaData';
import { DataServiceService } from './data-service.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class PartitaDBService {
/*
  partita?: PartitaData;
  speaker?: any;
  bingoSpeaker?: any;


  inizioPartitaSub!: Subscription;
  estrazioneNumeroSub!: Subscription;*/

  database;

  constructor() { 
    this.database = getDatabase();
  }

  //Metodi per modificare il DB
  //setto la partita a iniziata
  startPartita(codice: string): void{
    update(ref(this.database, 'partita/'+codice+'/'), {
      iniziata: true
    })
  }
  
  //Estrazione del numero
  public estrazioneNumero(codice: string, numero: number): void{
    update(ref(this.database, 'partita/'+codice+'/datiPartita'), {
      ultimoNumero: numero,
    })
  }

  //Dichiarazione del bingo
  dichiaraBingo(user: string, codice: string): void {
    update(ref(this.database, 'partita/'+codice+'/datiPartita/'), {
      bingo: user
    })
  }

  //Dichiarazione della cinquina
  dichiaraCinquina(user: string, codice: string): void {
    update(ref(this.database, 'partita/'+codice+'/datiPartita/'), {
      cinquina: user
    })
  }


  // OBSERVABLE: tutti le funzioni che leggono dal DB con onValue, ad ogni modifica aggiornano gli iscritti
  //Ascolto inizio partita
  ascoltoInizioPartita(codice: string): Observable<any>{
    const ascoltoInizioPartita = new Observable<any>((observer) => {
      const cod = ref(this.database, 'partita/'+codice+'/iniziata');
        onValue(cod, (snapshot) => {
            const c = snapshot.val();
            console.log("ascolto inizio partita", c);
            if(c !== null){
              console.log("dentro l'if")
              observer.next(c);
            }
        })
    })
    return ascoltoInizioPartita;
  }

  //Ascolta il numero appena estratto
  ascoltaNumero(codice: string): Observable<any>{
    const ascoltoNumero = new Observable<any>((observer) => {
      const cod = ref(this.database, 'partita/'+codice+'/datiPartita/ultimoNumero');
        onValue(cod, (snapshot) => {
          const c = snapshot.val();
          console.log("Numero estratto", c);
          if(c !== null){
            observer.next(c);
          }
        })
    })
    return ascoltoNumero;
  }

  //Ascolto se qualcuno chiama bingo
  ascoltaBingo(codice: string): Observable<any>{
    const ascoltaBingo = new Observable<any>((observer) => {
      const cod = ref(this.database, 'partita/'+codice+'/datiPartita/bingo');
        onValue(cod, (snapshot) => {
          const c = snapshot.val();
          console.log("Bingo", c);
          if(c !== null){
            observer.next(c);
          }
        })
    })
    return ascoltaBingo;
  }

  //Ascolto se qualcuno chiama cinquina
  ascoltaCinquina(codice: string): Observable<any>{
    const ascoltaCinquina = new Observable<any>((observer) => {
      const cod = ref(this.database, 'partita/'+codice+'/datiPartita/cinquina');
        onValue(cod, (snapshot) => {
          const c = snapshot.val();
          console.log("Cinquina", c);
          if(c !== null){
            observer.next(c);
          }
        })
    })
    return ascoltaCinquina;
  }
}
