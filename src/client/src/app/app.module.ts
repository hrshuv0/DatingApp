import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from "@angular/forms";
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './member/member-list/member-list.component';
import { MemberDetailComponent } from './member/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { SharedModule } from "./_modules/shared.module";
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { ErrorInterceptor } from "./_interceptor/error.interceptor";
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberCardComponent } from './member/member-card/member-card.component';
import { NgOptimizedImage } from "@angular/common";
import { JwtInterceptor } from "./_interceptor/jwt.interceptor";
import { MemberEditComponent } from './member/member-edit/member-edit.component';
import {LoadingInterceptor} from "./_interceptor/loading.interceptor";

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        HomeComponent,
        RegisterComponent,
        MemberListComponent,
        MemberDetailComponent,
        ListsComponent,
        MessagesComponent,
        TestErrorComponent,
        NotFoundComponent,
        ServerErrorComponent,
        MemberCardComponent,
        MemberEditComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        SharedModule,
        NgOptimizedImage
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
