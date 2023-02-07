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
    //Aggiorno localstorage
    this.Auth.set("timbro", this.url)
    //Aggiorno DB
    this.database.setTimbro(this.id!, this.Auth.get("user"))    window.location.reload();
  }

  coloraTimbro(): void {
    Array.from(document.getElementsByClassName('risposta')).forEach((elemento) => {
        if(elemento.textContent?.trim()){
          elemento.setAttribute('class', "timbro selezionato");
        } else {
          elemento.setAttribute('class', "timbro");
        }
      });
  }

}
