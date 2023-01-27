import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cella',
  templateUrl: './cella.component.html',
  styleUrls: ['./cella.component.scss'],
})
export class CellaComponent implements OnInit {

  @Input() numero?: number;
  @Input() estratto?:boolean;

  constructor() { }

  ngOnInit() {}

}
