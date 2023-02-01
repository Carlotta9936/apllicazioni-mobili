import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CreaPartitaService } from 'src/app/services/crea-partita.service';
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

  cinquinaDichiarata: boolean = false;
  cinquinaSub!: Subscription;

  codice: string = this.crea.getCodiceUrl();

  constructor(public partita: PartitaDBService, private Auth:AuthService, public crea: CreaPartitaService) { }

  ngOnInit() {
    this.compraScheda();
    this.ascoltaCinquina();
  }

  compraScheda(): any{
    /**
     * TODO: controllo crediti per comprare la scheda
     */
    this.numeroSchede.push(0);
  }

  abilitaBingo(value: any): void {
    console.log("Bingo abilitato")
    //console.log("VV", value)
    this.bingo = value;
  }

  abilitaCinquina(value: any): void {
    if(!this.cinquinaDichiarata && this.cinquina){
      console.log("Cinquina abilitata")
      this.cinquina = value;
    }
  }

  ascoltaCinquina(): void {
    this.cinquinaSub = this.partita.ascoltaCinquina(this.codice).subscribe((value) => {
      //console.log("value!=false", value!=false)
      if(value!=false){
        this.cinquinaDichiarata = true;
        this.cinquina = true;
        this.cinquinaSub.unsubscribe();
      }
    })
  }

  fineCinquina(): void {
    console.log("FINE CINQUINA");
    //Avverte il DB che è stato effettuata cinquina
    this.partita.dichiaraCinquina(this.Auth.get('user'), this.codice);
  }

  fineBingo(): void {
    console.log("FINE PARTITA")
    //Avverte il DB che è stato effettuato Bingo
    this.partita.dichiaraBingo(this.Auth.get('user'), this.codice);
  }

}
