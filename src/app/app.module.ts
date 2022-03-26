import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ModelModule } from "./model/model.module";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { routing } from './app.routing';
import { AddremarkComponent } from './addremark/addremark.component';
import { OverviewComponent } from './overview/overview.component';
import { TeachersComponent } from './teachers/teachers.component';
import { StudentsComponent } from './students/students.component';
import { SettingsComponent } from './settings/settings.component';
import { MessageModule} from './messages/message.module';
import { MessageComponent } from './messages/message.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SchoolSettingsComponent } from './schoolsettings/schoolsettings.component';
import { LoginActivate } from './auth/loginactivate.service';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { Forgotpassword2Component } from './forgotpassword2/forgotpassword2.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmadminfinalComponent } from './confirmadminfinal/confirmadminfinal.component';
import { StudentoverviewComponent } from './studentoverview/studentoverview.component';
import { RankingComponent } from './ranking/ranking.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ParentsComponent } from './parents/parents.component';
import { Angular2CsvModule } from 'angular2-csv';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AddremarkComponent,
    OverviewComponent,
    TeachersComponent,
    StudentsComponent,
    SettingsComponent,
    SchoolSettingsComponent,
    ForgotpasswordComponent,
    Forgotpassword2Component,
    SignupComponent,
    ConfirmadminfinalComponent,
    StudentoverviewComponent,
    RankingComponent,
    ParentsComponent
  ],
  imports: [
    BrowserModule,
    AngularFontAwesomeModule,
    ModelModule,
    FormsModule,
    ReactiveFormsModule,
    MessageModule,
    routing,
    BrowserAnimationsModule,
    NgxChartsModule,
    Angular2CsvModule 
  ],
  providers: [LoginActivate],
  bootstrap: [AppComponent, MessageComponent]
})
export class AppModule { }
