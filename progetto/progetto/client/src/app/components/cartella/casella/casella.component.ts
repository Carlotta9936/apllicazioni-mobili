import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-casella',
  templateUrl: './casella.component.html',
  styleUrls: ['./casella.component.scss'],
})
export class CasellaComponent implements OnInit {
  @Input() numero?: number;
  @Input() stato?: "vuota" | "numero" | "estratta" | "segnata";
  @Input() aiuti?: boolean;

  @Output() segnato = new EventEmitter<number>() //informo la casella che il numero è stato segnato

  timbro: string;
  
  constructor(public Auth: AuthService) {
    this.timbro = Auth.get("timbro");
   }

  ngOnInit() {}

  segna(): void {
    this.stato = "segnata";
    this.mandaSegnato();
  }

  //metodo iniviare alla scheda il cambio di stato di una cella
  mandaSegnato(){
    this.segnato.emit(this.numero);
  }

}
