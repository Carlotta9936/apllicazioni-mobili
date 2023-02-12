import { Injectable } from '@angular/core';
import { CreaPartitaService } from './crea-partita.service';
import { PartitaDBService } from './partita-db.service';

@Injectable({
  providedIn: 'root'
})
export class BossoloService {

  estratto?: string;
  bossolo: number[]=[];     //Bossolo sono effettivamente le palline, all'inizio contiene tutti i numeri, quando estraggo tolgo gli elementi da qui
  tabellone: boolean[]=[];  //Un array di boolean, serve per colorare il tabellone
  interval?: any;           //Timer per l'estrazione
  codice: string = this.crea.getCodiceUrl();

  constructor(public partita: PartitaDBService, public crea: CreaPartitaService){
    //creo un array con tutti i numeri estraibili 
    //e inizializzo il tabellone a false
      this.tabelloneVuoto();
   }

  //Crea un tabellone vuoto
  tabelloneVuoto():  any{
    this.tabellone = [];
    this.bossolo = [];
    for(let i=1;i<91;i++){
      this.bossolo.push(i);
      this.tabellone.push(false);
    }
  }

  //Timer per l'estrazione di un numero
  startTimer():void {
    this.interval = setInterval(() => {
      if(this.bossolo.length!=0){
        this.estrazione();
        console.log("Estrazione");
      }else{
        this.stopTimer();
      }
    },1500)
  }

  //Stoppa l'Interval per l'estrazione del numero
  stopTimer(): void{
    console.log("Stop timer");
    clearInterval(this.interval);
  }

  //Estrae un numero da 0 a lunghezza di Bossolo, il numero estratto sarà bossolo[RandomNumber]
  estraiNumero(): number{
    let num= Math.floor(Math.random() * (this.bossolo.length));
    let numeroEstratto = this.bossolo[num]
    this.bossolo.splice(num, 1);
    return numeroEstratto;
  }
  
  //Comunica l'estrazione a tutti
  estrazione(): void{
    //Si occupa dell'estrazione del numero dal bossolo
    let num=this.estraiNumero();
    //Aggiorno nel DB
    this.partita.estrazioneNumero(this.crea.getCodiceUrl(), num);
  }
}
