import { ModuleWithProviders, NgModule } from "@angular/core";
import { IAlertOptions, NGX_ALERT_CONFIG } from "./public-api";
import { NgxAlertModalService } from "./lib/ngx-alert-modal.service";

@NgModule({
    providers: [
        NgxAlertModalService
    ]
})
export class NgxAlertModalModule {
    static forRoot(config: IAlertOptions): ModuleWithProviders<NgxAlertModalModule> {
        return {
            ngModule: NgxAlertModalModule,
            providers: [
                {
                    provide: NGX_ALERT_CONFIG,
                    useValue: config
                }
            ]
        }
    }
}