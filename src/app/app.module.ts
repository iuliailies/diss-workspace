import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthenticationInterceptor} from "./services/authentication-interceptor.service";
import {ErrorInterceptor} from "./services/error-interceptor.service";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        HttpClientModule,
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
    bootstrap: [AppComponent]
})
export class AppModule { }
