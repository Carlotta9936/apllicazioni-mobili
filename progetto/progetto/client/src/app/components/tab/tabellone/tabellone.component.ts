import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BossoloService } from 'src/app/services/bossolo.service';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from 'src/app/services/database.service';
import { PartitaDBService } from 'src/app/services/partita-db.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-tabellone',
  templateUrl: './tabellone.component.html',
  styleUrls: ['./tabellone.component.scss'],
})
export class TabelloneComponent implements OnInit, OnDestroy {

  estratto: number=-1;
  numeri: number[]=[];
  estratti: boolean[]=[];
  numeriEstratti: number = 0;

  cinquina: null | string = null;
  bingo: null | string = null;

  timeLeft: number = 1;
  interval?: any;

  @Input() gioco: boolean = false;

  numeroSub!: Subscription;
  bingoSub!: Subscription;

  constructor(public bossolo: BossoloService, public partita: PartitaDBService) { 
    for(let i=1;i<=90;i++){
      this.numeri.push(i);
    }
    this.estratti=this.bossolo.tabellone;
  }
  
  ngOnDestroy(): void {
    console.log("DISTRUGGI TABELLONE")
    this.bossolo.tabelloneVuoto();
  }
  
  ngOnInit() {
    console.log("VAI");
    this.coloraTabellone();
    this.ascoltoBingo();
  }

  coloraTabellone() {
    console.log("Colora");
    this.numeroSub = this.partita.ascoltaNumero().subscribe((value : number) => {
        console.log("PP");
        this.estratto= value;
        this.estratti[value] = true;
    });
  }

  ascoltoBingo(): void{
    this.bingoSub = this.partita.ascoltaBingo().subscribe((value) => {
      if(value !== false){
        console.log("STOP");
        //this.partita.spegniAscoltoNumero();
        this.numeroSub.unsubscribe();
        this.bingoSub.unsubscribe();
        //this.partita.spegniAscoltoBingo();
      }
    })
  }
}
