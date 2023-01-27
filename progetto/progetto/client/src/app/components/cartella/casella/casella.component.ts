import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Casella } from 'src/app/interfaces/Casella';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-casella',
  templateUrl: './casella.component.html',
  styleUrls: ['./casella.component.scss'],
})
export class CasellaComponent implements OnInit {
  @Input() numero?: number;
  @Input() stato?: "vuota" | "numero" | "estratta" | "segnata";

  @Output() segnato = new EventEmitter<number>()

  timbro: string;
  
  constructor(public Auth: AuthService) {
    this.timbro = Auth.get("timbro");
   }

  ngOnInit() {}

  segna(): void {
    this.stato = "segnata";
    this.mandaSegnato();
  }

  mandaSegnato(){
    this.segnato.emit(this.numero);
  }

}
