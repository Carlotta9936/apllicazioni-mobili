import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BossoloService } from '../services/bossolo.service';
import { CreaPartitaService } from '../services/crea-partita.service';
import { DatabaseService } from '../services/database.service';
import { PartitaDBService } from '../services/partita-db.service';
import { ProprietarioService } from '../services/proprietario.service';

@Component({
  selector: 'app-partita',
  templateUrl: './partita.page.html',
  styleUrls: ['./partita.page.scss'],
})
export class PartitaPage implements OnInit {
  codice?: string;
  userProprietario?:string;
  iniziata: boolean = false;


  constructor(public crea: CreaPartitaService, public database: DatabaseService, 
    public auth: AuthService, public propr: ProprietarioService, public bossolo: BossoloService,
    public partita: PartitaDBService) { }

  ngOnInit() {
    this.codice=this.crea.getCodiceUrl();
    this.controllaProprietario();
    this.partita.setPartita(this.codice!);
  }

  public controllaProprietario():void{
    this.database.getPartita(this.codice!).then((promise) => {
      try{
        this.userProprietario=promise.proprietario;
        //faccio nuovamente il controllo sul proprietario per evitare che refresshando la pagina perda il valore true
        //l'assegnazione non viene fatta in principio qui perché avverrebbe troppo tardi (perchè è un controllo lento) rispetto
        //alla creazione della pagina stessa
        if(this.propr.proprietario!=true){
          if(promise.proprietario==this.auth.get("user")){ 
            this.propr.proprietario=true;
          }else{
            this.propr.proprietario=false;
          }
        }
      }catch (e){
        console.log("errore"+e);
      }
    });
  };

  start(): void {
    this.bossolo.startTimer();
    this.partita.ascoltaNumero().subscribe();
  }

  end(codice: string): void {
    this.database.eliminaPartita(codice);
    //this.bossolo.stopTimer();
    //this.router.navigate(['/tabs/tab1']);
  }

  //Tabellone

  //Solo se sei il proprietario
  estrazioneNumeri(): void{

  }

  //Schede



}
