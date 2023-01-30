import { Component, OnInit } from '@angular/core';
import { SchedaComponent } from '../scheda/scheda.component';

@Component({
  selector: 'app-schede',
  templateUrl: './schede.component.html',
  styleUrls: ['./schede.component.scss'],
})
export class SchedeComponent implements OnInit {

  numeroSchede: number[] = [];
  bingo: boolean = true;
  cinquina: boolean = true;

  constructor() { }

  ngOnInit() {
    this.compraScheda();
  }

  compraScheda(): any{
    this.numeroSchede.push(0);
  }


  abilitaBingo(value: any): void {
    console.log("Bingo abilitato")
    console.log("VV", value)
    this.bingo = value;
  }

  abilitaCinquina(value: any): void {
    console.log("T", this.cinquina)
    if(this.cinquina){
      console.log("Cinquina abilitata")
      this.cinquina =value;
    }
  }
  
  fineCinquina(): void {
    console.log("FINE CINQUINA");
    console.log("FINE CINQUINA");
    console.log("FINE CINQUINA");
    console.log("FINE CINQUINA");
    console.log("FINE CINQUINA");
    console.log("FINE CINQUINA");
    console.log("FINE CINQUINA");
    console.log("FINE CINQUINA");
    console.log("FINE CINQUINA");
    console.log("FINE CINQUINA");
    console.log("FINE CINQUINA");
    console.log("FINE CINQUINA");
    console.log("FINE CINQUINA");
  }

  
  fineBingo(): void {
    console.log("FINE PARTITA")
    console.log("FINE PARTITA")
    console.log("FINE PARTITA")
    console.log("FINE PARTITA")
    console.log("FINE PARTITA")
    console.log("FINE PARTITA")
    console.log("FINE PARTITA")
    console.log("FINE PARTITA")
    console.log("FINE PARTITA")
    console.log("FINE PARTITA")
    console.log("FINE PARTITA")
    console.log("FINE PARTITA")
  }

}
