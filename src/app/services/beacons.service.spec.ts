import { TestBed } from '@angular/core/testing';

import { BeaconsService } from './beacons.service';

describe('BeaconsService', () => {
  let service: BeaconsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeaconsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
