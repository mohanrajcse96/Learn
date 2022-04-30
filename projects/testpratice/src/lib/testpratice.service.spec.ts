import { TestBed } from '@angular/core/testing';

import { TestpraticeService } from './testpratice.service';

describe('TestpraticeService', () => {
  let service: TestpraticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestpraticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
