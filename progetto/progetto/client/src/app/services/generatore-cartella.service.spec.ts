import { TestBed } from '@angular/core/testing';

import { GeneratoreCartellaService } from './generatore-cartella.service';

describe('GeneratoreCartellaService', () => {
  let service: GeneratoreCartellaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneratoreCartellaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
