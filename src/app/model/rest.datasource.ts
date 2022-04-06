import { Injectable, Inject, InjectionToken } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Teacher } from "./teacher.model";
import { catchError } from "rxjs/operators";
import { SignupUser } from './signupUser.model';
import { EditPasswordForm } from './EditPasswordForm.model';
import { Student } from './student.model';
import { Class_schoolyear } from './class_schoolyear.model';
import { Schoolyear } from './schoolyear.model';
import { School } from './school.model';
import { HttpErrorResponse} from '@angular/common/http';
import { Loginresponse } from './loginrepsonse.model';
import { Remarkoptions } from './remarkoptions.model';
import { RemarksSaveForm } from './remarksSaveForm.model';
import { RemarkFilterForm } from './remarkFilterForm.model';
import { SignupSchool } from './signupSchool.model';
// import { MessageService } from '../messages/message.service';
// import { Message } from '../messages/message.model';
import * as jwt_decode from 'jwt-decode';
import { RankingSettings } from './rankingSettings.model';
import { ParentStudentInfo } from './parentStudentInfo.model';
import { Myresponse } from './myresponse.model';
import { RequestOptions } from "https";
import { domain } from "process";

export const REST_URL = new InjectionToken("rest_url");

@Injectable()
export class RestDataSource {
    
    // private schoolcodeInternal: string; 
    private $url1: string;

    constructor(private http: HttpClient,
        @Inject(REST_URL) private url: string,
        // private messageService: MessageService
        ) {  }

    // public setSchoolcodeInternal(schoolcode: string){
    //     this.schoolcodeInternal = schoolcode;
    // }

   //----------------------------------------------------- START OF USER METHODS ----------------------------------------------

   //  ORIGINAL
//    getUserByUsername(username: string): Observable<Student>{
//         return this.sendRequest<Student>("GET", this.url + '/' + JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/user/username/' + username);
//     }

    getUserByUsername(username: string): Observable<Student>{
        return this.sendRequest<Student>("GET", this.url + '/' + JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/user/username/' + username);
    }

    getLoggedInUser(): Observable<Student>{
        return this.sendRequest<Student>("POST",    this.getSubdomainRESTurl() + '/me');
    }

    // getLoggedInUser(): Observable<Student>{
    //     return this.sendRequest<Student>("POST", 'http://msninove.restfulapi.test/me');
    // }

   //----------------------------------------------------- END OF USER METHODS ----------------------------------------------


   //----------------------------------------------------- START OF TEACHER METHODS -----------------------------------------------
    getTeachers(): Observable<Teacher[]> {
        return this.sendRequest<Teacher[]>("GET", this.getSubdomainRESTurl() +'/teachers');
    }

    saveTeacher(teacher: SignupUser): Observable<SignupUser> {
        return this.sendRequest<SignupUser>("POST", this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/user1', teacher);
    }

    saveTeachers(teachers: SignupUser[]) : Observable<SignupUser[]> {
        return this.sendRequests<SignupUser[]>("POST", this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/users1', teachers);
    }

    updateTeacherInfo(teacher: Teacher): Observable<Teacher> {
        return this.sendRequest<Teacher>("PUT",
            this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/updateuserinfo', teacher);
    }

    updateTeacherPassword(editPasswordForm: EditPasswordForm): Observable<EditPasswordForm> {
        return this.sendRequest<EditPasswordForm>("PUT",
            this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/updateuserpassword', editPasswordForm);
    }

    deleteTeacher(id: number): Observable<Teacher> {
        return this.sendRequest<Teacher>("DELETE",  this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/user/' + id);
    }

//--------------------------------------- END OF TEACHER METHODS -----------------------------------------------------------------

//--------------------------------------- START OF PARENTS METHODS -----------------------------------------------------------------

getParents(): Observable<ParentStudentInfo[]> {
    let schoolyearfilter = JSON.parse(localStorage.getItem('currentSchool')).schoolyear_filter;
    return this.sendRequest<ParentStudentInfo[]>("GET", this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal+'/getParentsBySchoolyearAndCurrentClass/' + schoolyearfilter);
}

createParentAccountsForStudent(parent:SignupUser, studentid: number): Observable<Myresponse>{
    return this.sendRequest<Myresponse>("POST", this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal+'/parent/' + studentid, parent);
}

getChildByParentId(parentId: number): Observable<String> {
    return this.sendRequest<String>("GET", this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal+'/getUserByParentId/' + parentId);
}

//----------------------------------------------------- END OF PARENTS METHODS -----------------------------------------------

//----------------------------------------------------- START OF STUDENT METHODS -----------------------------------------------

getStudents(): Observable<Student[]> {
    // let schoolyearfilter = JSON.parse(localStorage.getItem('currentSchool'))[0].schoolyear_filter;
    let schoolyearfilter = JSON.parse(localStorage.getItem('currentSchool'))[0].schoolyear_filter;
    console.log('schoolyearfilter: ' + schoolyearfilter);
    return this.sendRequest<Student[]>("GET", this.getSubdomainRESTurl() +'/getStudentsBySchoolyearAndCurrentClass/' + schoolyearfilter);

    // return this.sendRequest<Student[]>("GET", this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal+'/getStudentsBySchoolyearAndCurrentClass/' + schoolyearfilter);
}

// getStudents1(): Observable<Object[]> {
//     // let schoolyearfilter = JSON.parse(localStorage.getItem('currentSchool')).schoolyear_filter;
//     return this.sendRequest<Student[]>("GET", 'http://msninove.restfulapi.test/students');
// }

// getStudents(): Observable<Student[]> {
//     return this.sendRequest<Student[]>("GET", this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal+'/students');
// }

saveStudent(student: SignupUser): Observable<SignupUser> {
    return this.sendRequest<SignupUser>("POST", this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/user1', student);
}

saveStudents(students: SignupUser[]) : Observable<SignupUser[]> {
    return this.sendRequests<SignupUser[]>("POST", this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/users1', students);
}

updateStudent(student: Student): Observable<Student> {
    return this.sendRequest<Student>("PUT",
        this.url + '/' + JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/update/user', student);
}

updateStudentInfo(student: Student): Observable<Student> {
    return this.sendRequest<Student>("PUT",
        this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/updateuserinfo', student);
}

updateStudentPassword(editPasswordForm: EditPasswordForm): Observable<EditPasswordForm> {
    return this.sendRequest<EditPasswordForm>("PUT",
        this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/updateuserpassword', editPasswordForm);
}

deleteStudent(id: number): Observable<Student> {
    return this.sendRequest<Student>("DELETE",  this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal+ '/user/' + id);
}

updateSchoolClass(student: Student): Observable<Student> {
    return this.sendRequest<Student>("PUT",
    this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/updateschoolclass', student);
}

//--------------------------------------- END OF STUDENT METHODS -----------------------------------------------------------------

getSchoolyears() {
    return this.sendRequest<Schoolyear[]>("GET", 
        this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/getSchoolyears');
}

//--------------------------------------- START OF FORGOT PASSWROD METHODS -----------------------------------------------------------------

forgotpassword1(email: string){
    return this.sendRequest<String>("POST",
        this.url + '/' + JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/forgotpassword1?email=' + email);
}

forgotpassword2(code: string, schoolcode: string, newpw: string){
    console.log(this.url + '/' + schoolcode + '/forgotpassword2/' + code + '/' + newpw);
    return this.sendRequest<String>("GET",
        this.url + '/' + schoolcode + '/forgotpassword2/' + code + '/' + newpw);
}

//--------------------------------------- END OF FORGOT PASSWROD METHODS -----------------------------------------------------------------

//--------------------------------------- START OF RANKING METHODS -----------------------------------------------------------------

updateRanking(){
    return this.sendRequest<[]>("POST", this.url + '/' + JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/updateRanking');
}

getAllRankings(){
    return this.sendRequest<[]>("GET", this.url + '/' + JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/allRankings');
}

getRankingsSortedByClass(){
    return this.sendRequest<[]>("GET", this.url + '/' + JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/getRankingsSortedByClass');
}

getClassRankings(classId: number){
    return this.sendRequest<[]>("GET", this.url + '/' + JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/classRankings/' + classId);
}

getRankingSettings(){
    return this.sendRequest<[]>("GET", this.getSubdomainRESTurl() + '/rankingsettings');
}

updateRankingSettings(settings: RankingSettings){
    return this.sendRequest<[]>("PUT", this.url + '/' + JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/updateRankingSettings', settings);
}

//--------------------------------------- END OF RANKING METHODS -----------------------------------------------------------------


//--------------------------------------- START OF SCHOOL METHODS -----------------------------------------------------------------

getSchools(){
    return this.sendRequest<School[]>("GET", 
        this.url + '/schools' +'/schools');
}

//ORIGINAL
// getSchoolInfoByExternalCode(externalcode: string){
//     return this.sendRequest<School>("GET", 
//         this.url + '/schools' +'/getSchoolInfoByExternalCode/' + externalcode);
// }

getSchoolInfoByExternalCode(externalcode: string){
    localStorage.setItem('schoolcode', externalcode);
    return this.sendRequest<School>("GET", 
    //this.getSubdomainRESTurl(externalcode) +'/getSchoolInfoByExternalCode/');
    this.getSubdomainRESTurl() +'/getSchoolInfoByExternalCode');
}

updateSchoolLanguage(language: string, schoolId: number){
    return this.sendRequest<School>("PUT",
        this.url + '/schools/updatelanguage/' + language + '/' + schoolId);
}

updateSchoolyearfilter(filter: number, schoolId: number){
    return this.sendRequest<School>("PUT",
        this.url + '/schools/updateschoolyearfilter/' + filter + '/' + schoolId);
}

//--------------------------------------- END OF SCHOOL METHODS -----------------------------------------------------------------

//--------------------------------------- START OF LOGIN METHODS -----------------------------------------------------------------

getCSRFToken(){

    const requestOptions = {
        withCredentials: true
       };
    console.log("getting csrf token1");
    return this.http.get<Loginresponse>('http://restfulapi.test/sanctum/csrf-cookie',requestOptions);
    
}

login(username: string, password: string, schoolcodeinternal: string){

    const requestOptions = {
        withCredentials: true
       };

    return this.http.post<Loginresponse>('http://' + localStorage.getItem('schoolcode') + '.restfulapi.test/login', 
        {
                    "email": username,
                    "password": password
        },requestOptions
    );
    
    // return this.sendRequest<Loginresponse>("POST", 
    // 'msninove.restfulapi.test/login', // '' + schoolcodeinternal + '.' + this.url, 
    //     {
    //         "username": username,
    //         "password": password
    //     }
    // );
}

//--------------------------------------- END OF LOGIN METHODS -----------------------------------------------------------------

//--------------------------------------- START OF REMARK METHODS -----------------------------------------------------------------

saveRemarks(remarks: RemarksSaveForm): Observable<RemarksSaveForm>{
    return this.sendRequest<RemarksSaveForm>("POST",
        this.getSubdomainRESTurl() + '/storeSameRemarkForMultipleStudents', remarks);
}

getFilteredRemarks(remarkFilter: RemarkFilterForm){
    console.log("remarksfilter");
    console.log(remarkFilter);
    return this.sendRequest<[]>("POST",
        this.getSubdomainRESTurl() + '/filteredRemarks', remarkFilter);
}

getStudentsOwnFilteredRemarks(remarkFilter: RemarkFilterForm){
    return this.sendRequest<[]>("POST",
        this.getSubdomainRESTurl() + '/filteredRemarks', remarkFilter);
}

deleteRemark(remarkId: number){
    return this.sendRequest<[]>("DELETE",
        this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/remark/' + remarkId);
}


//--------------------------------------- END OF REMARK METHODS -----------------------------------------------------------------

//--------------------------------------- START OF CLASSSCHOOLYEAR METHODS -----------------------------------------------------------------

addClassSchoolyear(cs: Class_schoolyear): Observable<Class_schoolyear>{
    return this.sendRequest<Class_schoolyear>("POST",
        this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/addClassSchoolyear', cs);
}

editClassSchoolyear(cs: Class_schoolyear){
    return this.sendRequest<[]>("PUT",
        this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/editClassSchoolyear', cs);
}

// getClassSchoolyearBySchoolyear(schoolyear_id: number) {
//     return this.sendRequest<Class_schoolyear[]>("GET", 
//         this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/getClassSchoolyearBySchoolyear/' + schoolyear_id);
// }

getClassSchoolyearBySchoolyear(schoolyear_id: number) {
    return this.sendRequest<Class_schoolyear[]>("GET", 
        this.getSubdomainRESTurl() + '/class1s?schoolyear_id=' + schoolyear_id);
}



deleteClassSchoolyear(csId: number){
    return this.sendRequest<[]>("DELETE",
        this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/deleteClassSchoolyear/' + csId);
}

//--------------------------------------- END OF CLASSSCHOOLYEAR METHODS -----------------------------------------------------------------


//--------------------------------------- START OF REMARKOPTIONS METHODS -----------------------------------------------------------------

// getRemarkoptions(){
//     return this.sendRequest<Remarkoptions[]>("GET", 
//         this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal +'/remarkoptions');
// }

getRemarkoptions(){
    return this.sendRequest<Remarkoptions[]>("GET", 
        this.getSubdomainRESTurl() +'/remarkoptions');
}

addRemarkoption(remarkoption: Remarkoptions): Observable<Remarkoptions> {
    return this.sendRequest<Remarkoptions>("POST",
        this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/remarkoption', remarkoption);
}

editRemarkoption(remarkoption: Remarkoptions): Observable<Remarkoptions> {
    return this.sendRequest<Remarkoptions>("PUT",
        this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/remarkoption', remarkoption);
}

deleteRemarkoption(remarkoption: Remarkoptions): Observable<Remarkoptions> {
    return this.sendRequest<Remarkoptions>("DELETE",
        this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/remarkoption', remarkoption);
}

//--------------------------------------- END OF REMARKOPTIONS METHODS -----------------------------------------------------------------

//--------------------------------------- START OF PERSONAL SETTINGS METHODS -----------------------------------------------------------------

validatePassword(editPasswordForm: EditPasswordForm): Observable<EditPasswordForm> {
    // console.log("Entering REST datasource");
    // console.log(editPasswordForm);
    return this.sendRequest<EditPasswordForm>("POST", 
        this.url + '/' +  JSON.parse(localStorage.getItem('currentSchool')).schoolcodeInternal + '/validatepassword', editPasswordForm);
}

//--------------------------------------- END OF PERSONAL SETTINGS METHODS -----------------------------------------------------------------

//--------------------------------------- START OF LANGUAGE METHODS -----------------------------------------------------------------
getLanguageText(langcode: string) {
    return this.sendRequest<string>("GET", 
        this.getSubdomainRESTurl() + '/multilangtext?language=' + langcode);
}

// getLanguageText(langcode: string) {
//     return this.sendRequest<string>("GET", 
//         this.url + '/schools' + '/getMultiLangText/' + langcode);
// }

//--------------------------------------- END OF LANGUAGE METHODS -----------------------------------------------------------------

//--------------------------------------- START OF SIGNUP SCHOOL METHODS -----------------------------------------------------------------

updateSchoolInfo(signupSchool: SignupSchool): Observable<School>{
    return this.sendRequest<School>("PUT",
        this.url + '/schools/updateschoolinfo', signupSchool);
}

confirmadmin(admin: SignupUser, confirmationuid: string, schoolcodeInternal: string) {
    return this.sendRequest<SignupUser>("POST", this.url + '/' +  schoolcodeInternal +'/confirmadmin?confirmationuid=' + confirmationuid, admin);
}

confirmadmin2(schoolcodeInternal: string, confirmationuid: string) {
    return this.sendRequest<SignupUser>("POST", this.url + '/schools/confirmadmin2?schoolcodeInternal=' + 
            schoolcodeInternal + '&confirmationuid=' + confirmationuid);
}

//--------------------------------------- END OF SIGNUP SCHOOL METHODS  -----------------------------------------------------------------

//--------------------------------------- START OF BASIC METHODS -----------------------------------------------------------------

    private sendRequest<T>(verb: string, url: string, body?: any)
        : Observable<T> {

        let myHeaders = new HttpHeaders();
        myHeaders = myHeaders.set("Access-Key", "<secret>");
        myHeaders = myHeaders.set("Application-Names", ["exampleApp", "proAngular"]);
        console.log(this.isJWTTokenValid());
        if(localStorage.getItem('accessToken')){
        // if(this.isJWTTokenValid()){
            myHeaders = myHeaders.set("Authorization","Bearer " + localStorage.getItem('accessToken'));
       }

        return this.http.request<T>(verb, url, {
            body: body,
            headers: myHeaders
        }).pipe(catchError((error: Response) => 
 //                   {
 //                       console.log(error.error);
 //                       console.error(error);

                         throwError(error)
                        // throwError(`Network Error: ${error.statusText} (${error.status}): ${error.error}`)
  //                      return Observable.throw("Error in sendrequest: " + error.error);
 //               }                           
                ));
        // }
        // else {
        // this.messageService.reportMessage(new Message("Oops! It seems like something went wrong. Please sign in again.", true));
        // }

    }

    private sendRequests<T>(verb: string, url: string, body?: any[])
    : Observable<T> {

    let myHeaders = new HttpHeaders();
    myHeaders = myHeaders.set("Access-Key", "<secret>");
    myHeaders = myHeaders.set("Application-Names", ["exampleApp", "proAngular"]);
    if(localStorage.getItem('accessToken')){
        myHeaders = myHeaders.set("Authorization","Bearer " + localStorage.getItem('accessToken'));
        // console.log("authorization header added");
    }

    return this.http.request<T>(verb, url, {
        body: body,
        headers: myHeaders
    }).pipe(catchError((error: Response) => 
        throwError(error)));
        // throwError(`Network Error: ${error.statusText} (${error.status})`)));
    }

    //------------------------------------ HELPER FUNCTIONS -------------------------------------------------------------
    
    isJWTTokenValid(): boolean {
        try{
            if(!localStorage.getItem('accessToken')){
                return false;
            }
            let token = localStorage.getItem('accessToken');
            let tokenInfo = jwt_decode(token); // decode token
            let expireDate = tokenInfo.exp; // get token expiration dateTime
            let today = Date.now();
            console.log(tokenInfo); // show decoded token object in console
            console.log(today);
            if(today > expireDate) {
                return false;
            }
            else return true;
        }
        catch(Error){
            return null;
        }
      }

      private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
      }

      private getSubdomainRESTurl(){
        var domainrest = this.url.substring(this.url.indexOf('/') + 2);
        console.log(domainrest);
    
        return 'http://' + localStorage.getItem('schoolcode') + '.' + domainrest;
    }


    //   private getSubdomainRESTurl(externalcode: string){
    //     var domainrest = this.url.substring(this.url.indexOf('/') + 2);
    //     console.log(domainrest);
    
    //     return 'http://' + externalcode + '.' + domainrest;
    // }

}
