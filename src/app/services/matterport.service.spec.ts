import { TestBed } from '@angular/core/testing';

import { MatterportService } from './matterport.service';

describe('MatterportService', () => {
  let service: MatterportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatterportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
