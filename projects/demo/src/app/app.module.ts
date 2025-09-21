import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NGX_ALERT_CONFIG } from 'projects/ngx-alert-modal/src/public-api';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: NGX_ALERT_CONFIG, useValue: {
        text: 'sdfsdf',
        confirmButtonText: 'sdfsdf'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
