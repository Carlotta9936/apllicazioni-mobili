import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-scelta-timbro',
  templateUrl: './scelta-timbro.component.html',
  styleUrls: ['./scelta-timbro.component.scss'],
})
export class SceltaTimbroComponent implements OnInit {

  selezionato?: any;
  @Input() url?: string;
  @Input() id?: number;
  constructor(public Auth: AuthService, public database: DatabaseService) { }

  ngOnInit() {
    this.selezionato=this.Auth.get("timbro");
  }

  seleziona(): void{
    //Aggiorno localstorage
    this.Auth.set("timbro", this.url)
    //Aggiorno DB
    this.database.setTimbro(this.id!, this.Auth.get("user"));
    window.location.reload();
  }
}
