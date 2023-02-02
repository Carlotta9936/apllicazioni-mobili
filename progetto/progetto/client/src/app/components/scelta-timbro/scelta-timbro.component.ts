import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-scelta-timbro',
  templateUrl: './scelta-timbro.component.html',
  styleUrls: ['./scelta-timbro.component.scss'],
})
export class SceltaTimbroComponent implements OnInit {

  selezionato?: any;
  @Input() url?: string;
  constructor(public Auth: AuthService) { }

  ngOnInit() {
    this.selezionato=this.Auth.get("timbro");
  }

  seleziona(): void{
    console.log("Seleziona");
    this.Auth.set("timbro", this.url)
    window.location.reload();
  }

}
