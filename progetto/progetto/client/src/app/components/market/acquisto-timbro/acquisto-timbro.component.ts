import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-acquisto-timbro',
  templateUrl: './acquisto-timbro.component.html',
  styleUrls: ['./acquisto-timbro.component.scss'],
})
export class AcquistoTimbroComponent implements OnInit {

  @Input() titolo?: string;
  @Input() img?: string;
  @Input() prezzo?: number;

  constructor() { }

  ngOnInit() {}

}
