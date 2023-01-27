import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Casella } from 'src/app/interfaces/Casella';
import { Partita } from 'src/app/interfaces/Partita';
import { BossoloService } from 'src/app/services/bossolo.service';
import { DatabaseService } from 'src/app/services/database.service';
import { SocketService } from 'src/app/services/socket.service';
import { GeneratoreCartellaService } from 'src/app/services/generatore-cartella.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-scheda',
  templateUrl: './scheda.component.html',
  styleUrls: ['./scheda.component.scss'],
})
export class SchedaComponent implements OnInit, OnDestroy {

  //Cartella
  numeri: number[] = [];
  caselle: Casella[] = [];

  //Bingo
  numeriBingo: number[] = [];

  //Cinquina
  prima?: number[] = [];
  seconda?: number[] = [];
  terza?: number[] = [];

  timeLeft: number = 3;
  interval?: any;

  obs: Subscription[] = [];

  constructor(public generatore: GeneratoreCartellaService, private http: HttpClient, public database: DatabaseService, public bossolo: BossoloService) {
  }

  ngOnInit() {
    this.getScheda();
    let sub = this.bossolo.ritornaNumero()
    .subscribe((estratto)=>{
      console.log("number"+estratto);
      if(this.numeri.includes(estratto)){
        this.segnaNumero(Number(estratto));
      }
    })
    this.obs?.push(sub)
      
    
  }

  ngOnDestroy(): void {
    console.log("DISTRUGGI");
    this.obs[this.obs.length-1].unsubscribe();
    this.bossolo.spegniSpeaker();
  }

  getScheda(): any{
    let data = this.generatore.getCartella();
    //Numeri per le cartelle
    this.numeri = data[0];
    console.log(this.numeri);
    this.numeri.forEach(n => {
      let casella: Casella = {
        numero: n, 
        stato: "numero"
      };
      this.caselle.push(casella);
    });

    //numeri per il bingo
    this.numeriBingo = data[1];

    //numeri per le cinquine
    this.prima = data[2];
    this.seconda = data[3];
    this.terza = data[4];
  }

  //Utilizza un Observer per controllare l'ultimo numero estratto
  public listenNumero():void{
    
  }

  //Bisogna spegnere il subscribe
  public stopListener(): void{
    
  }


  // ~ Controlli se caselle segnate ~

  //Controlla se l'ultimo numero estratto è presente nella cartella
  segnaNumero(numero: any): void {
    this.caselle.forEach(casella => {
      if(casella.numero === numero && casella.stato==="numero"){
        console.log("Ce  l'hai")
        casella.stato = "estratta";
      }
    });

  }

  onCasellaSegnata(value: any): void{
    console.log("VALUE", value);
    this.controlloVincita(value);
  }

  controlloVincita(value: number): any{
    this.numeri.forEach((numero: number, index: number) => {
      if(numero === value){
        this.numeri.splice(index, 1);
        if(this.numeri.length===0){
          this.bingo();
        }
      }
    })

    if(this.prima?.includes(value)) this.controlloCinquina(this.prima, value);
    else if(this.seconda?.includes(value)) this.controlloCinquina(this.seconda, value);
    else this.controlloCinquina(this.terza!, value);

  }

  controlloCinquina(riga: number[], value: number): any{
    riga.forEach((n:number, index: number) => {
      if(n === value){
        this.numeri.splice(index, 1);
        if(this.numeri.length===0){
          this.cinquina();
        }
      }
    })
  }

  bingo(): void {
    //Dovrà abilitare il bottone bingo
    console.log("BINGOOOOOO");
  }

  cinquina(): void {
    console.log("CINQUINAAAAA");
  }

  
}
