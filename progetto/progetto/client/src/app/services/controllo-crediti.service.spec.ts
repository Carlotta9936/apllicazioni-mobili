import { TestBed } from '@angular/core/testing';

import { ControlloCreditiService } from './controllo-crediti.service';

describe('ControlloCreditiService', () => {
  let service: ControlloCreditiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlloCreditiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
