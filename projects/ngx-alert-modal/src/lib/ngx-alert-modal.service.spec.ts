import { TestBed } from '@angular/core/testing';

import { NgxAlertModalService } from './ngx-alert-modal.service';

describe('NgxAlertModalService', () => {
  let service: NgxAlertModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxAlertModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
