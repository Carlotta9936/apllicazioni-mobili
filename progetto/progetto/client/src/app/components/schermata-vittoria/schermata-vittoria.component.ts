import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ControlloCreditiService } from 'src/app/services/controllo-crediti.service';
import { CreaPartitaService } from 'src/app/services/crea-partita.service';
import { DatabaseService } from 'src/app/services/database.service';
import { EliminaPartitaService } from 'src/app/services/elimina-partita.service';
import { PartitaDBService } from 'src/app/services/partita-db.service';
import { ProprietarioService } from 'src/app/services/proprietario.service';

@Component({
  selector: 'app-schermata-vittoria',
  templateUrl: './schermata-vittoria.component.html',
  styleUrls: ['./schermata-vittoria.component.scss'],
})
export class SchermataVittoriaComponent implements OnInit {

  @Input() risultato!: string;
  vincitoreBingo!: boolean | string;
  vincitaBingo: number = 0;
  vincitoreCinquina!: boolean | string;
  vincitaCinquina: number = 0;
  numeriEstratti: number = 0;

  superbingo: boolean = false;

  codice: string = this.crea.getCodiceUrl();

  constructor(public partita: PartitaDBService, public crea: CreaPartitaService, public prop: ProprietarioService,
    public elimina: EliminaPartitaService ,private router: Router, public database: DatabaseService, public crediti: ControlloCreditiService,
    public auth: AuthService ) { }

  ngOnInit() {
    this.partita.getRisultati(this.codice).then((value) => {
      console.log("VALUUE", value);
      this.vincitoreBingo = value.bingo;
      this.vincitaBingo = value.premioBingo;
      this.vincitoreCinquina = value.cinquina;
      this.vincitaCinquina = value.premioCinquina;
      this.numeriEstratti = value.numeriEstratti;

      if(this.auth.get("user") === value.bingo){
        this.crediti.aggiornaCrediti(-value.premioBingo);
        if(this.numeriEstratti < 49){
          this.crediti.aggiornaCrediti(-100);
          this.database.incrementaNumeroSuperbingo(this.auth.get("user"));
          this.superbingo = true;
        }
        this.database.incrementaNumeroBingo(this.auth.get("user"));
      }
      
      if(this.auth.get("user") === value.cinquina){
        console.log("CINQUINA");
        this.crediti.aggiornaCrediti(-value.premioCinquina);
        this.database.incrementaNumeroCinquine(this.auth.get("user"));

      }
    })
  }

  continua(): void {
    if(this.prop.proprietario){
      //Reset partita
      this.partita.resetDatiPartita(this.codice)
    }
    console.log("fratm");
    //Vai alla stanza della partita
    //this.router.navigate(['partita/'+this.codice])
    window.location.reload();
  }

  esci(): void{
    if(this.prop.proprietario){
      this.database.serverOffline(this.codice);
      //Elimina partita
      this.elimina.cancelPartita(this.codice);
    } else {
      //Decrementa numero di giocatori
      this.database.decrementaGiocatori(this.codice);
      //Esci dalla partita
      this.router.navigate(['/tabs/tab1']);
    }
  }
}
