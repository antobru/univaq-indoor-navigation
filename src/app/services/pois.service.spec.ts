import { TestBed } from '@angular/core/testing';

import { PoisService } from './pois.service';

describe('PoisService', () => {
  let service: PoisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
