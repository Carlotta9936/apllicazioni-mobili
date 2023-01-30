import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Casella } from 'src/app/interfaces/Casella';
import { Partita } from 'src/app/interfaces/Partita';
import { BossoloService } from 'src/app/services/bossolo.service';
import { DatabaseService } from 'src/app/services/database.service';
import { SocketService } from 'src/app/services/socket.service';
import { GeneratoreCartellaService } from 'src/app/services/generatore-cartella.service';
import { Observable, Subscription } from 'rxjs';
import { PartitaDBService } from 'src/app/services/partita-db.service';
import { ECDH } from 'crypto';

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

  @Output() abilitaBingo = new EventEmitter<boolean>();
  @Output() abilitaCinquina = new EventEmitter<boolean>();


  constructor(public generatore: GeneratoreCartellaService, public database: DatabaseService, 
    public bossolo: BossoloService, public partita: PartitaDBService) {
  }

  ngOnInit() {
    this.getScheda();
    this.listenNumero();
  }


  
  ngOnDestroy(): void {
    console.log("DISTRUGGI");
    this.partita.ascoltaNumero().unsubscribe();
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
    this.partita.ascoltaNumero()
      .subscribe((value : number) => { 
        //console.log("scheda", value);
        this.segnaNumero(value);
    });
    
  }

  //Bisogna spegnere il subscribe
  public stopListener(): void{
    this.partita.ascoltaNumero().unsubscribe();
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
    //Controllo per il bingo
    this.numeriBingo.forEach((numero: number, index: number) => {
      if(numero === value){
        this.numeriBingo.splice(index, 1);
        console.log("Numeri mancanti", this.numeriBingo);
        if(this.numeriBingo.length===0){
          this.bingo();
        }
      }
    })

    if(this.prima?.includes(value)) this.controlloCinquina(this.prima, value);
    else if(this.seconda?.includes(value)) this.controlloCinquina(this.seconda, value);
    else this.controlloCinquina(this.terza!, value);

  }

  controlloCinquina(riga: number[], value: number): any{
    console.log("Controllo cinquina")
    riga.forEach((n:number, index: number) => {
      if(n === value){
        riga.splice(index, 1);
        console.log("Riga", riga);
        if(riga.length===0){
          this.cinquina();
        }
      }
    })
  }

  bingo(): void {
    //Dovrà abilitare il bottone bingo
    console.log("BINGOOOOOO");
    this.abilitaBingo.emit(false);
  }

  cinquina(): void {
    console.log("CINQUINAAAAA");
    this.abilitaCinquina.emit(false);
  }

  
}
