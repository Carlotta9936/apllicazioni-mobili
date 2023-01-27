import { TestBed } from '@angular/core/testing';

import { PartitaDBService } from './partita-db.service';

describe('PartitaDBService', () => {
  let service: PartitaDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartitaDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
