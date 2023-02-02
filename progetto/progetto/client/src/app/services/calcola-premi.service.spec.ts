import { TestBed } from '@angular/core/testing';

import { CalcolaPremiService } from './calcola-premi.service';

describe('CalcolaPremiService', () => {
  let service: CalcolaPremiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalcolaPremiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
