import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-schermata-vittoria',
  templateUrl: './schermata-vittoria.component.html',
  styleUrls: ['./schermata-vittoria.component.scss'],
})
export class SchermataVittoriaComponent implements OnInit {

  @Input() risultato!: string;
  @Input() vincitoreBingo!: string;
  vincitaBingo: number = 0;
  @Input() vincitoreCinquina!: string;
  vincitaCinquina: number = 0;
  numeriEstratti: number = 0;

  constructor() { }

  ngOnInit() {}

}
