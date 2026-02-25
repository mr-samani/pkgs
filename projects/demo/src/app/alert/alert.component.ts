import { Component, OnInit } from '@angular/core';
import { AlertResult } from 'projects/ngx-alert-modal/src/models/alert-result';
import { AlertOptions } from 'projects/ngx-alert-modal/src/models/AlertOptions';
import { NgxAlertModalService } from 'projects/ngx-alert-modal/src/public-api';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: false,
})
export class AlertComponent implements OnInit {
  options = new AlertOptions();
  result?: AlertResult;
  constructor(private alert: NgxAlertModalService) {
    this.options.title = 'Message Title';
    this.options.text = 'Message Body';
    this.options.icon = 'success';

    this.options.useOverlay = true;
  }

  ngOnInit(): void {}

  openModal() {
    this.alert.show(this.options).then((result) => {
      this.result = result;
    });
  }
}
