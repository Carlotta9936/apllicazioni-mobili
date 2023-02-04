import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-scelta-timbro',
  templateUrl: './scelta-timbro.component.html',
  styleUrls: ['./scelta-timbro.component.scss'],
})
export class SceltaTimbroComponent implements OnInit {

  @Input() url?: string;
  constructor(public Auth: AuthService) { }

  ngOnInit() {}

  seleziona(): void{
    console.log("Seleziona");
    this.Auth.set("timbro", this.url)
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
