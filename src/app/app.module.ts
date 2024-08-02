import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LanguageSelectorComponent } from './components/shared/language-selector/language-selector.component';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { PaginatorI18n } from './components/shared/paginator.i18n';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HistoryComponent } from './components/shared/history/history.component';
import { HistoryViewComponent } from './components/shared/history/history-view/history-view.component';
import { A11yModule } from '@angular/cdk/a11y';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateFormatYYYYMMDDDirective } from './components/shared/directives/date-format-yyyy-mm-dd.directive';
import { DateFormatSlashYYYYMMDDDirective } from './components/shared/directives/date-format-slash-yyyy-mm-dd.directive';
import { DateFormatMMYYYYDirective } from './components/shared/directives/date-format-mm-yyyy.directive';
import { WashingMachineModule } from './components/washing-machine/washing-machine.module';
import { SharedModule } from './components/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    
    RegisterComponent,
    LoginComponent,

    HistoryComponent,
    HistoryViewComponent,    
    
    // DIRECTIVES
    DateFormatYYYYMMDDDirective,
    DateFormatSlashYYYYMMDDDirective,
    DateFormatMMYYYYDirective
  ],
  imports: [    
    SharedModule,
    WashingMachineModule,

    BrowserModule,
    BrowserAnimationsModule,
    A11yModule,

    AppRoutingModule,    
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi:true
    },
    { 
      provide: DateAdapter, 
      useClass: MomentDateAdapter, 
      deps: [MAT_DATE_LOCALE] 
    },
    {
      provide: MatPaginatorIntl,
      useClass: PaginatorI18n
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
