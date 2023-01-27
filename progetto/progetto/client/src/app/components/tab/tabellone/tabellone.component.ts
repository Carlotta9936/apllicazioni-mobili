import { Component, OnDestroy, OnInit } from '@angular/core';
import { BossoloService } from 'src/app/services/bossolo.service';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-tabellone',
  templateUrl: './tabellone.component.html',
  styleUrls: ['./tabellone.component.scss'],
})
export class TabelloneComponent implements OnInit, OnDestroy {

  estratto: number=0;
  numeri: number[]=[];
  estratti: boolean[]=[];
  numeriEstratti: number = 0;

  cinquina: null | string = null;
  bingo: null | string = null;

  timeLeft: number = 1;
  interval?: any;

  constructor(public bossolo: BossoloService, private http: HttpClient, public database: DatabaseService) { 
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
  }


  
}
