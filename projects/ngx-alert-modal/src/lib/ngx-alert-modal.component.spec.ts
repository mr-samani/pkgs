import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAlertModalComponent } from './ngx-alert-modal.component';

describe('NgxAlertModalComponent', () => {
  let component: NgxAlertModalComponent;
  let fixture: ComponentFixture<NgxAlertModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgxAlertModalComponent]
    });
    fixture = TestBed.createComponent(NgxAlertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
