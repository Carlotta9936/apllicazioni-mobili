import { Component, OnDestroy, OnInit } from '@angular/core';
import { BossoloService } from 'src/app/services/bossolo.service';
import { DatabaseService } from 'src/app/services/database.service';
import { PartitaDBService } from 'src/app/services/partita-db.service';
import { Subscription } from 'rxjs';
import { CreaPartitaService } from 'src/app/services/crea-partita.service';

@Component({
  selector: 'app-tabellone',
  templateUrl: './tabellone.component.html',
  styleUrls: ['./tabellone.component.scss'],
})
export class TabelloneComponent implements OnInit, OnDestroy {

  estratto: number=-1; //numero estratto mostrato in alto
  numeri: number[]=[];
  estratti: boolean[]=[];
  numeriEstratti: number = 0;

  cinquina: null | string = null;
  bingo: null | string = null;

  numeroSub!: Subscription; //ascolto numeri estratti
  bingoSub!: Subscription; //ascolto se qualcuno fa bingo

  constructor(public bossolo: BossoloService, public partita: PartitaDBService, public crea: CreaPartitaService, public database: DatabaseService) { 
    //costruzione tabellone
    for(let i=1;i<=91;i++){
      this.numeri.push(i);
      this.estratti.push(false);
    }
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
    this.numeroSub = this.partita.ascoltaNumero(this.crea.getCodiceUrl())
      .subscribe((value: number) => {
        this.estratto= value;
        this.estratti[value] = true;
      })
  }

  ascoltoBingo(): void{
    this.bingoSub = this.partita.ascoltaBingo(this.crea.getCodiceUrl()).subscribe((value) => {
      if(value !== false){
        console.log("STOP");
        this.numeroSub.unsubscribe();
        this.bingoSub.unsubscribe();
      }
    })
  }
}
