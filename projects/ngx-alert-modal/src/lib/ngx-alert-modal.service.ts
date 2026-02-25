import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Inject,
  Injectable,
  Injector,
} from '@angular/core';
import { NGX_ALERT_CONFIG, defaultOptions } from '../models/AlertOptions';
import { IAlertOptions } from '../models/IAlertOptions';
import { NgxAlertModalComponent } from './ngx-alert-modal.component';
import { AlertResult } from '../models/alert-result';
import { applyDefaultConfig } from '../helper/apply-default';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class NgxAlertModalService {
  currentAdIndex = -1;
  alerts: ComponentRef<NgxAlertModalComponent>[] = [];
  insertedId = 0;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    @Inject(DOCUMENT) private _doc: Document,
  ) {}

  public show(config: IAlertOptions): Promise<AlertResult<any>> {
    let d = applyDefaultConfig(
      this.injector.get(NGX_ALERT_CONFIG, defaultOptions),
      defaultOptions,
    );
    config = applyDefaultConfig(config, d);
    return new Promise((resolve, reject) => {
      const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(
          NgxAlertModalComponent,
        );
      const componentRef = componentFactory.create(this.injector);
      this.appRef.attachView(componentRef.hostView);

      this.appendDialogComponentToBody(componentRef, config);
      componentRef.instance.options = config;
      componentRef.instance.index = this.insertedId;
      componentRef.instance.onClose.subscribe((result) => {
        this.removeDialogComponentFromBody(result.index);
        resolve(result.result);
      });
      this.alerts.push(componentRef);
      this.insertedId++;
    });
  }

  private removeDialogComponentFromBody(index: number): void {
    if (this.alerts[index]) {
      const domElem = (this.alerts[index].hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;

      // قبل از destroy باید hidePopover صدا بزنیم
      if (domElem.popover === 'manual') {
        try {
          domElem.hidePopover();
        } catch {}
      }

      this.appRef.detachView(this.alerts[index].hostView);
      this.alerts[index].destroy();
    }
  }

  private appendDialogComponentToBody(
    componentRef: ComponentRef<NgxAlertModalComponent>,
    config: IAlertOptions,
  ) {
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    if (config.containerClass) {
      for (let c of config.containerClass.split(' ')) {
        if (c.trim()) domElem.classList.add(c);
      }
    }
    this._doc.body.appendChild(domElem);
    if (config.useOverlay) {
      domElem.popover = 'manual';
      domElem.showPopover();
    }
  }

  closeAll() {
    for (let i = 0; i < this.alerts.length; i++) {
      this.removeDialogComponentFromBody(i);
    }
  }
}
