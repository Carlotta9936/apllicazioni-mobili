import { TestBed } from '@angular/core/testing';

import { BossoloService } from './bossolo.service';

describe('BossoloService', () => {
  let service: BossoloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BossoloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
