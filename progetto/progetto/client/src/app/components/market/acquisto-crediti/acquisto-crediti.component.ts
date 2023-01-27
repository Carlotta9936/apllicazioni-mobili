import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-acquisto-crediti',
  templateUrl: './acquisto-crediti.component.html',
  styleUrls: ['./acquisto-crediti.component.scss'],
})
export class AcquistoCreditiComponent implements OnInit {

  @Input() titolo?: string;
  @Input() img?: string;
  @Input() prezzoFalso?: number;
  @Input() prezzo?: number;

  constructor() { }

  ngOnInit() {}

}
