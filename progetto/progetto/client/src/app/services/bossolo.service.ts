import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class BossoloService {

  estratto?: string;
  bossolo: number[]=[];     //Bossolo solo effettivamente le palline, all'inizio contiene tutti i numeri, quando estraggo tolgo gli elementi da qui
  tabellone: boolean[]=[];  //Un array di boolean, serve per colorare il tabellone

  timeLeft: number = 1;
  interval?: any;

  speaker: any;

  constructor(public socket: SocketService, 
              public auth: AuthService //per test
    ){
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
    console.log("Tab", this.tabellone)
   } 

   //Estrae un numero da 0 a lunghezza di Bossolo, il numero estratto sarà bossolo[RandomNumber]
   estraiNumero(): number{
    return Math.floor(Math.random() * (this.bossolo.length));
  }

  //Comunica l'estrazione a tutti
  estrazione(): void{
    //this.socket.estraiNumero(this.bossolo[this.estraiNumero()], this.auth.get('user'));
    window.location.reload;
  }

  //Timer per l'estrazione di un numero
  startTimer():void {
    this.interval = setInterval(() => {
      if(this.bossolo.length!=0){
        if(this.timeLeft > 0) {
          this.timeLeft--;
          //console.log("tempo"+this.timeLeft);
        } else {
          this.timeLeft = 1;
          this.estrazione();
        }
      }else{
        this.stopTimer();
      }
    },1000)
  }

  //Stoppa l'Interval per l'estrazione del numero
  stopTimer(): void{
    clearInterval(this.interval);
  }

  //Colora il numero nel tabellone
  segnaNumero(numero: any): void{
    this.tabellone[numero]=true;
  }

  //Ascolta il numero fa tutte le modifiche
  ascoltaNumero(index: number): any{
    //let numero= this.bossolo[index];
    this.segnaNumero(index);
    this.bossolo.splice(index,1);
  }

  //Comunica con l'Observable a tutti gli iscritti il numero appena uscito
  ritornaNumero(): Observable<number>{
    const numeroEstratto=new Observable<number>((observer)=>{
      this.speaker = setInterval(() => {
        //let numero=Number(this.estratto);
        console.log("NuMeRo", Number(this.estratto));
        observer.next(Number(this.estratto));
      }, 1000)
    })
    return numeroEstratto;
  }

  //Spegne l'Interval per la comunicazione dei numeri
  spegniSpeaker(): void{
    clearInterval(this.speaker);
  }
}
