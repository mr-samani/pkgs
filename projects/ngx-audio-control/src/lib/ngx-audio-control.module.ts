import { NgModule } from '@angular/core';
import { NgxAudioControlComponent } from './ngx-audio-control.component';
import { CommonModule } from '@angular/common';
import { NgxAudioControlService } from './ngx-audio-control.service';


@NgModule({
  declarations: [
    NgxAudioControlComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NgxAudioControlComponent
  ],
  providers: [
    NgxAudioControlService
  ]
})
export class NgxAudioControlModule { }
