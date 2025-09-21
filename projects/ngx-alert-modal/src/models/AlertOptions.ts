import { Inject, InjectionToken } from "@angular/core";
import { IAlertOptions } from "./IAlertOptions";

export type AlertIcon = 'None' | 'success' | 'error' | 'warning' | 'info' | 'question'

export const NGX_ALERT_CONFIG = new InjectionToken<IAlertOptions>('IAlertOptions');

export const defaultOptions: AlertOptions = {
    title: '',
    text: '',
    html: '',
    backdrop: true,
    icon: 'None',
    width: undefined,
    allowOutsideClick: true,
    allowEscapeKey: true,
    allowEnterKey: true,
    showConfirmButton: true,
    showDenyButton: false,
    showCancelButton: false,
    confirmButtonText: 'Ok',
    denyButtonText: 'No',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '',
    denyButtonColor: '',
    cancelButtonColor: '',
    confirmButtonAriaLabel: '',
    denyButtonAriaLabel: '',
    cancelButtonAriaLabel: '',
    reverseButtons: false,
    showCloseButton: false,
    containerClass: '',
}


export class AlertOptions implements IAlertOptions {
    public constructor(
        private config?: IAlertOptions,
    ) {
        //config = { ...(new AlertOptions()), ...config };
    }

    title?: string = this.config?.title;
    text?: string = this.config?.text;
    html?: string | HTMLElement = '';
    backdrop?: boolean = true;
    icon?: AlertIcon;
    width?: number | string;
    allowOutsideClick?: boolean = true;
    allowEscapeKey?: boolean = true;
    allowEnterKey?: boolean = true;
    showConfirmButton?: boolean = true;
    showDenyButton?: boolean = false;
    showCancelButton?: boolean = false;
    confirmButtonText: string = this.config?.confirmButtonText ?? 'Ok';
    denyButtonText?: string = 'No';
    cancelButtonText?: string = 'Cancel';
    confirmButtonColor?: string;
    denyButtonColor?: string;
    cancelButtonColor?: string;
    confirmButtonAriaLabel?: string = '';
    denyButtonAriaLabel?: string = '';
    cancelButtonAriaLabel?: string = '';
    reverseButtons?: boolean = false;
    showCloseButton?: boolean = false;
    containerClass?: string = '';
}