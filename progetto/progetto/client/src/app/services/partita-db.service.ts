import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Partita } from '../interfaces/Partita';
import { PartitaData } from '../interfaces/PartitaData';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class PartitaDBService {

  partita?: PartitaData;
  speaker?: any;
  bingoSpeaker?: any;

  constructor(public database: DatabaseService) {}

  //Setto la partita nel service
  setPartita(codice: string): void{
    this.database.getPartita(codice).then((value: PartitaData) => {
      this.partita = value;
      console.log("pippo",this.partita);
      return this.partita;
    })
  }

  getProprietario(): string {
    console.log("partita",this.partita);
    console.log("propr:", this.partita?.proprietario!);
    return this.partita?.proprietario!;
  }
  
  //Aggiorna nel DB il numero appena uscito
  estrazioneNumero(numero: number): void{
    return this.database.estrazioneNumero(this.partita?.codice, numero);
  }
  
  //Comunica con l'Observable a tutti gli iscritti il numero appena uscito
  ascoltaNumero(): any{
    const numeroEstratto=new Observable<number>((observer)=>{
      this.speaker = setInterval(() => {
        this.database.ascoltaNumero(this.partita?.codice).then((value) => {
          console.log("VVV", value);
          observer.next(value);
        })
      }, 1000);
    });
    
  /*
    const numeroEstratto=new Observable<number>((observer)=>{
      let num = -1;
      this.database.ascoltaNumero(this.partita?.codice).subscribe((numero) => {
        num = numero
        console.log("ascolto numero:", num);
        observer.next(num);
      })
    });
  */
    return numeroEstratto;
  }

  /*spegniAscoltoNumero(): void{
    console.log("Stop ascolto numero");
    clearInterval(this.speaker);
  }*/

  //Aggiorna il DB per dichiarare bingo
  bingo(user: string): void {
    this.database.dichiaraBingo(user, this.partita?.codice);
  }

  //Legge il DB per leggere se è stato fato un bingo
  ascoltaBingo(): Observable<any> {
    console.log("Ascolta bingo on");
    const ascoltaBingo = new Observable<any>((observer) => {
      this.bingoSpeaker = setInterval(() => {
        this.database.ascoltaBingo(this.partita?.codice).then((value) => {
          observer.next(value);
        })
      }, 1000);
    })
    return ascoltaBingo;
  }

  //Aggiorna il DB per dichiarare cinquina
  cinquina(user: string): void {
    this.database.dichiaraCinquina(user, this.partita?.codice);
  }

  //Legge il DB per leggere se è stata fatta cinquina
  ascoltaCinquina(): Observable<any>{
    console.log("Ascolto cinquina on");
    const ascoltaCinquina = new Observable<any>((observer) => {
      setInterval(() => {
        this.database.ascoltaCinquina(this.partita?.codice).then((value) => {
          observer.next(value);
        })
      }, 1000)
    })

    return ascoltaCinquina;
  }
}
