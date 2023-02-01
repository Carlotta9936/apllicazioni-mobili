import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Casella } from 'src/app/interfaces/Casella';
import { Partita } from 'src/app/interfaces/Partita';
import { BossoloService } from 'src/app/services/bossolo.service';
import { DatabaseService } from 'src/app/services/database.service';
import { GeneratoreCartellaService } from 'src/app/services/generatore-cartella.service';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { PartitaDBService } from 'src/app/services/partita-db.service';
import { ECDH } from 'crypto';
import { CreaPartitaService } from 'src/app/services/crea-partita.service';

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

  //EventEmitter per comunicare con il component padre la possibilità di fare cinquina
  @Output() abilitaBingo = new EventEmitter<boolean>();
  @Output() abilitaCinquina = new EventEmitter<boolean>();

  numSub!: Subscription;
  bingoSub!: Subscription;

  constructor(public generatore: GeneratoreCartellaService, public database: DatabaseService, 
    public bossolo: BossoloService, public partita: PartitaDBService, public crea: CreaPartitaService) {
  }

  //Azioni all'avvio del component
  ngOnInit() {
    this.getScheda();
    this.listenNumero();
    this.ascoltoBingo();
  }
  
  //Azioni quando distruggi il component
  ngOnDestroy(): void {
    console.log("DISTRUGGI");
    this.stopListener();
  }
  
  //Utilizza un Observer per controllare l'ultimo numero estratto
  public listenNumero():void{
    this.numSub = this.partita.ascoltaNumero(this.crea.getCodiceUrl())
      .subscribe((value) => {
        console.log("scheda", value);
        this.segnaNumero(value);
      })
  }

  //Bisogna spegnere il subscribe
  public stopListener(): void{
    console.log("Stop listener")
    this.numSub.unsubscribe();
    this.bingoSub.unsubscribe();
    //this.partita.spegniAscoltoBingo();
  }

  ascoltoBingo(): void{
    this.bingoSub = this.partita.ascoltaBingo(this.crea.getCodiceUrl()).subscribe((value) => {
      if(value !== false){
        console.log("STOP");
        this.stopListener();
      }
    })
  }

  /** Chiama il generatore di cartelle che restituisce:
  * [0] Tutti i numeri (compresi gli 0) per la creazione della cartella
  * [1] Solo i numeri, per controllare il bingo
  * [2] I numeri della prima riga, per controllare la cinquina
  * [3] I numeri della seconda riga, per controllare la cinquina
  * [4] I numeri della terza riga, per controllare la cinquina
  */
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

    //Controllo cinquine
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
    console.log("BINGOOOOOO");
    //Abilità il bottone bingo nel component 'Schede'
    this.abilitaBingo.emit(false);
  }
  
  cinquina(): void {
    console.log("CINQUINAAAAA");
    //Abilità il bottone cinquina nel component 'Schede'
    this.abilitaCinquina.emit(false);
  }

  
}
