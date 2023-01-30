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

  constructor(public database: DatabaseService) {}

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
          observer.next(value);
        })
      }, 1000);
    });
    return numeroEstratto;
/*
    const numeroEstratto=new Observable<number>((observer)=>{
      let num = -1;
      this.database.ascoltaNumero(this.partita?.codice).subscribe((numero) => {
        num = numero
        console.log("ascolto numero:", num);
        observer.next(num);
      })
    });

    return numeroEstratto;
    */
  }
}
