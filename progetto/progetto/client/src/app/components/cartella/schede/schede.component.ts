import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PartitaDBService } from 'src/app/services/partita-db.service';
import { SchedaComponent } from '../scheda/scheda.component';

@Component({
  selector: 'app-schede',
  templateUrl: './schede.component.html',
  styleUrls: ['./schede.component.scss'],
})
export class SchedeComponent implements OnInit {
  @Input() iniziata?: boolean;
  @Input() finePartita: boolean = false;

  numeroSchede: number[] = [];
  bingo: boolean = true;
  cinquina: boolean = true;

  constructor(public partita: PartitaDBService, private Auth:AuthService) { }

  ngOnInit() {
    this.compraScheda();
  }

  compraScheda(): any{
    /**
     * TODO: controllo crediti per comprare la scheda
     */
    this.numeroSchede.push(0);
  }

  abilitaBingo(value: any): void {
    console.log("Bingo abilitato")
   // console.log("VV", value)
    this.bingo = value;
  }

  abilitaCinquina(value: any): void {
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
    //Avverte il DB che è stato effettuato Bingo
    this.partita.bingo(this.Auth.get('user'));
  }

}
