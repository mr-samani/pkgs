import { Component, HostListener } from '@angular/core';
import { IAlertOptions } from "../models/IAlertOptions";
import { Subject } from 'rxjs';
import { AlertResult, DismissReason } from '../models/alert-result';
import { CommonModule } from '@angular/common';
import { NGX_ALERT_CONFIG, defaultOptions } from '../public-api';

@Component({
  selector: 'lib-ngx-alert-modal',
  templateUrl: 'ngx-alert-modal.component.html',
  styleUrls: ['./ngx-alert-modal.component.scss', './ngx-alert-icons.scss'],
  standalone: true,
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: NGX_ALERT_CONFIG,
      useValue: defaultOptions
    }
  ]
})
export class NgxAlertModalComponent {
  options!: IAlertOptions;
  index = 0;

  private readonly _onClose = new Subject<{ index: number, result: AlertResult<any> }>();
  public onClose = this._onClose.asObservable();


  @HostListener('document:keydown.escape', ['$event'])
  onScapeKey(event: Event) {
    if (this.options.allowEscapeKey) {
      this.onCancel();
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.options.allowEnterKey) {
      if (this.options.showConfirmButton) {
        this.onConfirm();
      } else if (this.options.showDenyButton) {
        this.onDeny();
      } else {
        this.onCancel()
      }
    }
  }



  onConfirm() {
    this._onClose.next({
      index: this.index,
      result: {
        isConfirmed: true,
        isDismissed: false,
        isDenied: false,
        dismiss: DismissReason.close,
      }
    }
    );
  }
  onCancel() {
    this._onClose.next({
      index: this.index,
      result: {
        isConfirmed: false,
        isDismissed: true,
        isDenied: false,
        dismiss: DismissReason.cancel,
      }
    }
    );
  }
  onDeny() {
    this._onClose.next({
      index: this.index,
      result: {
        isConfirmed: false,
        isDismissed: false,
        isDenied: true,
        dismiss: DismissReason.close,
      }
    }
    );
  }
  close() {
    this.onCancel();
  }


  onOutSideClick() {
    if (this.options.allowOutsideClick) {
      this.onCancel();
    }
  }
  innerOnClick(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
  }
}
