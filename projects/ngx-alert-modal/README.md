# NgxAlertModal

Angular modal/Alert/Popup

Simple popup modal 
like sweetalert2

## 📦Demo
Preview [Demo](https://mr-samani.github.io/pkgs/alert)


## 🗃️ Install
- NPM: npm i ngx-alert-modal
- YARN: yarn add ngx-alert-modal

## Standalone

## 🖥️Usage

## 💬For open popup
```
import { Component, OnInit } from '@angular/core';
import { NgxAlertModalService } from 'ngx-alert-modal';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  constructor(
    private alert: NgxAlertModalService
  ) { }

  ngOnInit(): void {
  }


  openPopup() {
    this.alert.show({
      title: 'Message Title',
      text: 'Description',
      icon: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
    }).then(r => {
      console.log('result=', r);
    });
  }

}
```

## Setting Global Options
Pass values to NgxAlertModalModule.forRoot() or provider to set global options.

- Module based
```
// app NgModule
imports: [
  NgxAlertModalModule.forRoot({
    confirmButtonText: 'تائید',
    cancelButtonText: 'انصراف',
    ...
  }),
],

```
- Provider
```
import { NGX_ALERT_CONFIG } from 'ngx-alert-modal';

// app NgModule
providers:[
   {
      provide: NGX_ALERT_CONFIG, useValue: {
          confirmButtonText: 'تائید',
          cancelButtonText: 'انصراف',
          ...
      }
    }
]
```




## ⚙️Options

```
export type AlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question'

export class AlertOptions {
    /**
    * The title of the popup
    *
    * @default ''
    */
    title?: string = '';

    /**
     * A description for the popup.
     *
     * @default ''
     */
    text?: string = '';

    /**
     * A HTML description for the popup.
     *
     * [Security] we does NOT sanitize this parameter. It is the developer's responsibility
     * to escape any user input when using the `html` option, so XSS attacks would be prevented.
     *
     * @default ''
     */
    html?: string | HTMLElement = '';


    /**
     * Whether or not  should show a full screen click-to-dismiss backdrop.
     * Either a boolean value or a css background value (hex, rgb, rgba, url, etc.)
     *
     * @default true
     */
    backdrop?: boolean = true;


    icon?: AlertIcon;

    /**
     * Popup width, including paddings (`box-sizing: border-box`).
     *
     * @default undefined
     * @description ❌⚠️NOT Implemented!⚠️❌
     */
    width?: number | string


    /**
     * If set to `false`, the user can't dismiss the popup by clicking outside it.
     *
     * @default true
     */
    allowOutsideClick?: boolean = true;

    /**
     * If set to `false`, the user can't dismiss the popup by pressing the Escape key.
     *
     * @default true
     */
    allowEscapeKey?: boolean = true;

    /**
     * If set to `false`, the user can't confirm the popup by pressing the Enter or Space keys,
     * unless they manually focus the confirm button.
     *
     * @default true
     */
    allowEnterKey?: boolean = true;


    /**
     * If set to `false`, the "Confirm" button will not be shown.
     *
     * @default true
     */
    showConfirmButton?: boolean = true;

    /**
     * If set to `true`, the "Deny" button will be shown, which the user can click on to deny the popup.
     *
     * @default false
     */
    showDenyButton?: boolean = false;

    /**
     * If set to `true`, the "Cancel" button will be shown, which the user can click on to dismiss the popup.
     *
     * @default false
     */
    showCancelButton?: boolean = true;

    /**
     * Use this to change the text on the "Confirm" button.
     *
     * @default 'OK'
     */
    confirmButtonText?: string = 'Ok';

    /**
     * Use this to change the text on the "Confirm" button.
     *
     * @default 'No'
     */
    denyButtonText?: string = 'No';

    /**
     * Use this to change the text on the "Cancel" button.
     *
     * @default 'Cancel'
     */
    cancelButtonText?: string = 'Cancel';

    /**
     * Use this to change the background color of the "Confirm" button.
     *
     * @default undefined
     * @description ❌⚠️NOT Implemented!⚠️❌
     */
    confirmButtonColor?: string;

    /**
     * Use this to change the background color of the "Deny" button.
     *
     * @default undefined
     * @description ❌⚠️NOT Implemented!⚠️❌
     */
    denyButtonColor?: string;

    /**
     * Use this to change the background color of the "Cancel" button.
     *
     * @default undefined
     * @description ❌⚠️NOT Implemented!⚠️❌
     */
    cancelButtonColor?: string;

    /**
     * Use this to change the `aria-label` for the "Confirm" button.
     *
     * @default ''
     */
    confirmButtonAriaLabel?: string = '';

    /**
     * Use this to change the `aria-label` for the "Deny" button.
     *
     * @default ''
     */
    denyButtonAriaLabel?: string = '';

    /**
     * Use this to change the `aria-label` for the "Cancel" button.
     *
     * @default ''
     */
    cancelButtonAriaLabel?: string = '';


    /**
     * Set to `true` if you want to invert default buttons positions.
     *
     * @default false
     * @description ❌⚠️NOT Implemented!⚠️❌
     */
    reverseButtons?: boolean = false;



    /**
     * Set to `true` to show close button.
     *
     * @default false
     */
    showCloseButton?: boolean = false;


    containerClass?: string = '';
}
```


## Author
💻Mohammadreza samani | FrontEnd Developer

[❤️Buy me a coffee 😉](https://www.buymeacoffee.com/mrsamani)

 
