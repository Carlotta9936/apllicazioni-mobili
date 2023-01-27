import { TestBed } from '@angular/core/testing';

import { TimbriService } from './timbri.service';

describe('TimbriService', () => {
  let service: TimbriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimbriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
