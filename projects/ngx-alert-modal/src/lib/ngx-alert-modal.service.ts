import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertOptions } from './options';
import { NgxAlertModalComponent } from './ngx-alert-modal.component';


@Injectable({
  providedIn: 'root'
})
export class NgxAlertModalService {
  currentAdIndex = -1;
  alerts: ComponentRef<NgxAlertModalComponent>[] = [];
  insertedId = 0;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
  ) { }


  public fire(config: AlertOptions): Promise<any> {
    config = { ...(new AlertOptions()), ...config };
    return new Promise((resolve, reject) => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NgxAlertModalComponent);
      const componentRef = componentFactory.create(this.injector);
      this.appRef.attachView(componentRef.hostView);

      this.appendDialogComponentToBody(componentRef, config);
      componentRef.instance.options = config;
      componentRef.instance.index = this.insertedId;
      componentRef.instance.onClose.subscribe((index) => {
        this.removeDialogComponentFromBody(index);
      });
      this.alerts.push(componentRef);
      this.insertedId++;
    });
  }


  private removeDialogComponentFromBody(index: number): void {
    if (this.alerts[index]) {
      this.appRef.detachView(this.alerts[index].hostView);
      this.alerts[index].destroy();
    }
  }

  private appendDialogComponentToBody(componentRef: ComponentRef<NgxAlertModalComponent>, config: AlertOptions) {
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    if (config.containerClass) {
      for (let c of config.containerClass.split(' ')) {
        if (c.trim())
          domElem.classList.add(c);
      }
    }
    document.body.appendChild(domElem);
  }

  closeAll() {
    for (let i = 0; i < this.alerts.length; i++) {
      this.removeDialogComponentFromBody(i);
    }
  }



}