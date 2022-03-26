
import {Routes, RouterModule} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {AddremarkComponent} from "./addremark/addremark.component";
import { OverviewComponent } from './overview/overview.component';
import { SettingsComponent } from './settings/settings.component';
import { SchoolSettingsComponent } from './schoolsettings/schoolsettings.component';
import { TeachersComponent } from './teachers/teachers.component';
import { StudentsComponent } from './students/students.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { Forgotpassword2Component } from './forgotpassword2/forgotpassword2.component';
import { LoginActivate } from './auth/loginactivate.service';
import { SignupComponent } from './signup/signup.component';
import { ConfirmadminfinalComponent } from './confirmadminfinal/confirmadminfinal.component';
import { StudentoverviewComponent } from './studentoverview/studentoverview.component';
import { RankingComponent } from './ranking/ranking.component';
import { ParentsComponent } from './parents/parents.component';

const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path: "addremark", component: AddremarkComponent, canActivate:[LoginActivate]},
    {path : "overview", component: OverviewComponent, canActivate:[LoginActivate]},
    {path : "ranking", component: RankingComponent, canActivate:[LoginActivate]},
    {path : "settings", component: SettingsComponent, canActivate:[LoginActivate]},
    {path: "teachers", component : TeachersComponent, canActivate:[LoginActivate]},
    {path: "students", component : StudentsComponent, canActivate:[LoginActivate]},
    {path: "parents", component : ParentsComponent, canActivate:[LoginActivate]},
    {path : "schoolsettings", component: SchoolSettingsComponent, canActivate:[LoginActivate]},
    {path: "forgotpassword", component: ForgotpasswordComponent},
    {path: "forgotpassword2/:code/:schoolcode", component: Forgotpassword2Component},
    {path: "signup", component: SignupComponent},
    {path: "confirmadminfinal", component: ConfirmadminfinalComponent},
    {path: "studentoverview", component: StudentoverviewComponent},
    {path: "**", component: LoginComponent}
]

export const routing = RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'});