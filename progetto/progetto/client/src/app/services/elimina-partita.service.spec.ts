import { TestBed } from '@angular/core/testing';

import { EliminaPartitaService } from './elimina-partita.service';

describe('EliminaPartitaService', () => {
  let service: EliminaPartitaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EliminaPartitaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
