import { Component, OnInit, Input } from '@angular/core';
import { SchedaComponent } from '../scheda/scheda.component';

@Component({
  selector: 'app-schede',
  templateUrl: './schede.component.html',
  styleUrls: ['./schede.component.scss'],
})
export class SchedeComponent implements OnInit {
  @Input() iniziata?: boolean;

  numeroSchede: number[] = [];

  constructor() { }

  ngOnInit() {
    this.compraScheda();
  }

  compraScheda(): any{
    this.numeroSchede.push(0);
  }


  fine(): void {
    
  }
}
