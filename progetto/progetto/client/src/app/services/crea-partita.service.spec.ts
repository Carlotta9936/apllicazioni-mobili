import { TestBed } from '@angular/core/testing';

import { CreaPartitaService } from './crea-partita.service';

describe('CreaPartitaService', () => {
  let service: CreaPartitaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreaPartitaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
