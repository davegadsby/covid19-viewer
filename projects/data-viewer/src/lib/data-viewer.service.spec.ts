import { TestBed } from '@angular/core/testing';

import { DataViewerService } from './data-viewer.service';

describe('DataViewerService', () => {
  let service: DataViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
