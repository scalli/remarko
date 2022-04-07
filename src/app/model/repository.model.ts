import { Injectable, ɵoverrideProvider } from "@angular/core";
import { Teacher } from "./teacher.model";
import { Student } from "./student.model";
import { Observable } from "rxjs";
import { RestDataSource } from "./rest.datasource";
import { SignupUser } from './signupUser.model';
import { EditPasswordForm } from './EditPasswordForm.model';
import { Subject } from 'rxjs';
import { MessageService } from '../messages/message.service';
import { Message } from '../messages/message.model';
import { TeachersComponent } from '../teachers/teachers.component';
import { Schoolyear } from './schoolyear.model';
import { Class_schoolyear } from './class_schoolyear.model';
import { Remarkoptions } from './remarkoptions.model';
import { School } from './school.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RemarksSaveForm } from './remarksSaveForm.model';
import { RemarkFilterForm } from './remarkFilterForm.model';
import { SignupSchool } from './signupSchool.model';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { RankingSettings } from './rankingSettings.model'
import { ParentStudentInfo } from './parentStudentInfo.model';
import { Myresponse } from './myresponse.model';

@Injectable()
export class Model {
    private teachers: Teacher[] = new Array<Teacher>();
    teachersChangeDetected = new Subject();

    private students: Student[] = new Array<Student>();
    studentsChangeDetected = new Subject();

    remarkoptionChangeDetected = new Subject();
    schoolyearFilterUpdated = new Subject();
    csChangeDetected = new Subject();
    remarksSaved = new Subject();
    remarkDeleted = new Subject();
    filteredRemarksArrived = new Subject();
    HTMLTextLoaded = new Subject();
    classSchoolyearsLoaded = new Subject();
    schoolInfoUpdated = new Subject();
    adminCreated = new Subject();
    adminConfirmed = new Subject();
    studentPasswordUpdated = new Subject();
    allRankingsLoaded = new Subject();
    classRankingsLoaded = new Subject();
    rankingSettingsLoaded = new Subject();
    rankingSettingsUpdated = new Subject();
    parentsLoaded = new Subject();
    childLoaded = new Subject();
    accountChanged = new Subject();

    studentLoggedIn = new Subject();
    loginFailed = new Subject();
    passwordValid = new Subject();

    filteredRemarks: [];

    private schoolyears: Schoolyear[] = new Array<Schoolyear>();
    private classSchoolyears: Class_schoolyear[] = new Array<Class_schoolyear>();

    private currentSchoolyearId: number = 1;
    private language: string = "nl";
    private currentSchool: School;

    private accessToken: string;

    private HTMLText;

    public parsedCsv: string[] = [];

    private locator = (p: Teacher, id: number) => p.id == id;

    constructor(private dataSource: RestDataSource, 
                private messageService: MessageService,
                private activeRoute: ActivatedRoute,
                private router: Router) {
        // this.dataSource.getSchoolyears().subscribe(
        //     data => {
        //         this.schoolyears = data
        //     },
        //     error => {
        //         this.loginFailed.next("login failed");
        //     }
        // );
        // this.dataSource.getClassSchoolyearBySchoolyear(this.currentSchoolyearId).subscribe(
        //     data => {
        //         this.classSchoolyears = data;
        //     },
        //     error => {
        //         this.loginFailed.next("login failed");
        //     }

        // );
        // this.dataSource.getTeachers().subscribe(
        //     data => {
        //         this.teachers = data;
        //         this.teachersChangeDetected.next("teachers loaded");
        //     },
        //     error => {
        //         this.loginFailed.next("login failed");
        //     }
        // );
    }

    ngOnInit(){
 //       this.HTMLText = JSON.parse(localStorage.getItem('multiLangText'));
        this.HTMLTextLoaded.subscribe(
          data => {
            this.HTMLText = JSON.parse(localStorage.getItem('multiLangText'));
          }
        )
    }
//----------------------------------------------------- START OF TEACHER METHODS -----------------------------------------------
 
    getTeachersFromRAM() : Teacher[]{
        return this.teachers;
    }
    
    getTeachers(): Teacher[] {
        this.dataSource.getTeachers().subscribe(
            data => 
                {
                    this.teachers = data['data'];
                    //this.messageService.reportMessage(new Message("Teachers loaded successfully.",false));
                    localStorage.setItem('teachers',JSON.stringify(this.teachers));
                    this.teachersChangeDetected.next(data);
                    // console.log(this.teachers.length + " teachers in repository: " + this.teachers);
                    // console.log(data.length + " data in repository: " + data);
                }, 
            error => {
                this.handleError(error, this.HTMLText[50]);
                // this.messageService.reportMessage(new Message(this.HTMLText[50], true));
            }
        );
        return this.teachers;
    }

    getTeacher(id: number): Teacher {
        this.teachers  = JSON.parse(localStorage.getItem('teachers'));
        let t = this.teachers.find(i => i.id === id);
        // console.log(localStorage.getItem('teachers'));
        // console.log(t);
        return t;
        // return this.teachers.find(p => this.locator(p, id));
    }

    signUpTeacher(signup: SignupUser){
        console.log("entering signUpTeacher in model");
        this.dataSource.saveTeacher(signup).subscribe
        (p => 
            {
                this.HTMLText = JSON.parse(localStorage.getItem('multiLangText'));
                this.messageService.reportMessage(new Message(this.HTMLText[51] + " " + signup.firstName + " " + signup.lastName + " " + this.HTMLText[61] , false))
                console.log("Callback after signup user with name: " + p.firstName + " " + p.lastName);
                // this.teachersChangeDetected.next("Change detected");
                this.getTeachers();
            }, 
        error => {
            this.handleError(error, this.HTMLText[52]);
            // this.messageService.reportMessage(new Message(this.HTMLText[52] , true)) 
        }     
        );
    }

    signUpTeachers(signups: SignupUser[]){
        this.dataSource.saveTeachers(signups).subscribe(
            p => 
                {
                    this.messageService.reportMessage(new Message(signups.length + this.HTMLText[53] , false));
                    this.getTeachers();
                    console.log("Callback after signing up " + signups.length + " users");
                }, 
            error => {
                this.handleError(error, this.HTMLText[54]);
                // this.messageService.reportMessage(new Message(this.HTMLText[54] , true))
            }    
            );
    }
    
    updateTeacherInfo(teacher: Teacher){
        this.dataSource.updateTeacherInfo(teacher).subscribe(
            p => 
                {
                    this.messageService.reportMessage(new Message(this.HTMLText[55] + " " + teacher.firstName + " " + teacher.lastName + " updated.", false))
                    this.getTeachers();
                    console.log("Callback after signing up " + teacher.lastName);
                }, 
            error => {
                this.getTeachers();
                this.handleError(error, this.HTMLText[56]);
                // this.messageService.reportMessage(new Message(this.HTMLText[56] , true));
            }
        )
    } 
    
    updateTeacherPassword(editPasswordForm: EditPasswordForm){
        this.dataSource.updateTeacherPassword(editPasswordForm).subscribe( 
        p => 
            {
                this.messageService.reportMessage(new Message(this.HTMLText[57] , false))
                this.getTeachers();
                console.log("Callback after changing password. ");
            },
        error => {
            this.handleError(error, this.HTMLText[58]);
            // this.messageService.reportMessage(new Message(this.HTMLText[58] , true))
        });
    }

    deleteTeacher(id: number) {
        this.dataSource.deleteTeacher(id).subscribe(
            p => 
                { 
                    this.messageService.reportMessage(new Message(this.HTMLText[59] , false))
                    this.getTeachers();
                    console.log("Callback after delete teacher for id: " + p.id);
                }, 
                error => {
                    this.handleError(error, this.HTMLText[60]);
                    // this.messageService.reportMessage(new Message(this.HTMLText[60] , true));
                    console.log(error);
                }
        );
    }

//--------------------------------------- END OF TEACHER METHODS -----------------------------------------------------------------

//--------------------------------------- START OF PARENTS METHODS -----------------------------------------------------------------

getParents(): ParentStudentInfo[] {
    let infos: ParentStudentInfo[];
    this.dataSource.getParents().subscribe(
        data => {
            // console.log(data);
            localStorage.setItem('parents', JSON.stringify(data));
            this.parentsLoaded.next(data);
            return data;
        },
        error => {
            this.handleError(error, this.HTMLText[164]);
        }
    );
    return infos;
}

getChildByParentId(parentId: number) {
    console.log("entering getChildByParentId " + parentId);
    this.dataSource.getChildByParentId(parentId).subscribe(
        data => {
            console.log("child data");
            console.log(data);
            localStorage.setItem('child', JSON.stringify(data));
            this.childLoaded.next(data);
        },
        error => {
            console.log("error getting child");
        }
    )
}

createParentAccountsForStudent(parent:SignupUser, studentid: number) {
    this.dataSource.createParentAccountsForStudent(parent, studentid).subscribe(
        data => {
            console.log("parent account is created");
            console.log(data);
            this.accountChanged.next();
        },
        error => {
            console.log("ERROR: parent account was not created");
            console.log(error);
        }
    )
}

updateParentPassword(editPasswordForm: EditPasswordForm){
    this.dataSource.updateStudentPassword(editPasswordForm).subscribe( 
    p => 
        {
            this.studentPasswordUpdated.next(true);
            this.messageService.reportMessage(new Message(this.HTMLText[69], false));
            console.log("Callback after changing password. ");
            this.accountChanged.next();
        },
    error => {
        this.studentPasswordUpdated.next(false);
        this.handleError(error, this.HTMLText[73]);
        // this.messageService.reportMessage(new Message(this.HTMLText[73], true));
    });
}

//----------------------------------------------------- END OF PARENTS METHODS -----------------------------------------------

//----------------------------------------------------- START OF STUDENT METHODS -----------------------------------------------

getStudentsFromRAM() : Student[]{
    return this.students;
}

// getStudents1(): Object[] {
//     this.dataSource.getStudents1().subscribe(
//         data => 
//             {
//                 this.students = data;
//                 console.log(data);
//                 //this.students.sort(this.sortByclass);
//                 //this.messageService.reportMessage(new Message("Teachers loaded successfully.",false));
//                 localStorage.setItem('students',JSON.stringify(this.students));
//                 this.studentsChangeDetected.next(data);
//                 // console.log(this.teachers.length + " teachers in repository: " + this.teachers);
//                 // console.log(data.length + " data in repository: " + data);
//             },
//             error => {
//                 this.handleError(error, this.HTMLText[62]);
//                 // this.messageService.reportMessage(new Message(this.HTMLText[62], true))
//                 this.loginFailed.next("login failed");
//             }  
//     );
//     return this.students;
// }


getStudents(): Student[] {
    this.dataSource.getStudents().subscribe(
        data => 
            {
                console.log("studenten");
                console.log(data);
                this.students = data["data"];
                this.students.sort(this.sortByclass);
                //this.messageService.reportMessage(new Message("Teachers loaded successfully.",false));
                localStorage.setItem('students',JSON.stringify(this.students));
                this.studentsChangeDetected.next(data);
                // console.log(this.teachers.length + " teachers in repository: " + this.teachers);
                // console.log(data.length + " data in repository: " + data);
            },
            error => {
                this.handleError(error, this.HTMLText[62]);
                // this.messageService.reportMessage(new Message(this.HTMLText[62], true))
                this.loginFailed.next("login failed");
            }  
    );
    return this.students;
}

sortByclass(stud1: Student, stud2: Student): number{
    if(stud1.class1 == stud2.class1) {
        if (stud1.lastName < stud2.lastName){
            return -1;
        }
        else return 1;
    }
    if(stud1.class1 > stud2.class1) {
        return 1;
    }
    if(stud1.class1 < stud2.class1) {
        return -1;
    }
}

getStudent(id: number): Student {
    this.students  = JSON.parse(localStorage.getItem('students'));
    let t = this.students.find(i => i.id === id);
    return t;
    // return this.students.find(p => this.locator(p, id));
}

// getStudent(id: number): Student {
//     for(var i=0; i<this.students.length; i++){
//         if(this.students[i].id = id){
//             return this.students[i];
//         }
//     }
//     return null;
// }

signUpStudent(signup: SignupUser){
    this.dataSource.saveStudent(signup).subscribe
    (p => 
        {
            this.HTMLText = JSON.parse(localStorage.getItem('multiLangText'));
            this.messageService.reportMessage(new Message(this.HTMLText[63] + " " + signup.firstName + " " + signup.lastName + this.HTMLText[61], false))
            console.log("Callback after signup user with name: " + p.firstName + " " + p.lastName);
            // this.teachersChangeDetected.next("Change detected");
            this.getStudents();
        }, 
    error => {
        this.handleError(error, this.HTMLText[64] + error.error.text);
        // this.messageService.reportMessage(new Message(this.HTMLText[64] + error.error.text, true)) ;
        console.log("Error in signUpStudent: ");
        console.log("Network Error: " + error.statusText + " " + error.status);
        console.log(error);
        }     
    );
}

signUpStudentNoGetStudents(signup: SignupUser){
    this.dataSource.saveStudent(signup).subscribe
    (p => 
        {
            this.HTMLText = JSON.parse(localStorage.getItem('multiLangText'));
            this.messageService.reportMessage(new Message(this.HTMLText[63] + signup.firstName + " " + signup.lastName + this.HTMLText[61], false))
            console.log("Callback after signup user with name: " + p.firstName + " " + p.lastName);
            // this.teachersChangeDetected.next("Change detected");
            // this.getStudents();
        }, 
    error => {
        this.handleError(error, this.HTMLText[64] + error.error.text);
        // this.messageService.reportMessage(new Message(this.HTMLText[64] + error.error.text, true)) ;
        console.log("Error in signUpStudent: ");
        console.log("Network Error: " + error.statusText + " " + error.status);
        console.log(error);
        }     
    );
}

signUpStudents(signups: SignupUser[]){
    this.dataSource.saveStudents(signups).subscribe(
        p => 
            {
                this.messageService.reportMessage(new Message(signups.length + this.HTMLText[65], false));
                this.getStudents();
                console.log("Callback after signing up " + signups.length + " users");
                console.log(p);
            }, 
        error => 
            {
                this.handleError(error, this.HTMLText[66] + error.error.text);
                console.log("Error in signUpStudents: ");
                console.log("Network Error: " + error.statusText + " " + error.status);
                console.log(error);
                // this.messageService.reportMessage(new Message(this.HTMLText[66] + error.error.text, true));
            }
        );
}

updateStudent(student: Student){
    this.dataSource.updateStudent(student).subscribe(
        p => 
            {
                this.messageService.reportMessage(new Message(this.HTMLText[67] + student.firstName + " " + student.lastName + this.HTMLText[68], false))
                this.getStudents();
                console.log("Callback after updating " + student.lastName);
            },
        error => {
            this.handleError(error, this.HTMLText[71]);
            // this.messageService.reportMessage(new Message(this.HTMLText[71], true));
        }
    )
}

updateStudentInfo(student: Student){
    this.dataSource.updateStudentInfo(student).subscribe(
        p => 
            {
                this.messageService.reportMessage(new Message(this.HTMLText[67] + student.firstName + " " + student.lastName + this.HTMLText[68], false))
                this.getStudents();
                console.log("Callback after signing up " + student.lastName);
            }, 
        error => {
            this.handleError(error, this.HTMLText[72]);
            this.getStudents();
            // this.messageService.reportMessage(new Message(this.HTMLText[72], true))
        }
    )
} 

updateStudentPassword(editPasswordForm: EditPasswordForm){
    this.dataSource.updateStudentPassword(editPasswordForm).subscribe( 
    p => 
        {
            this.studentPasswordUpdated.next(true);
            this.messageService.reportMessage(new Message(this.HTMLText[69], false));
            //Only get students if user is no admin or teacher
            if(JSON.parse(localStorage.getItem('currentUser')).role > 2){
                this.getStudents();
            }
            console.log("Callback after changing password. ");
        },
    error => {
        this.studentPasswordUpdated.next(false);
        this.handleError(error, this.HTMLText[73]);
        // this.messageService.reportMessage(new Message(this.HTMLText[73], true));
    });
}

deleteStudent(id: number) {
    this.dataSource.deleteStudent(id).subscribe(
        p => 
            { 
                this.messageService.reportMessage(new Message(this.HTMLText[70], false))
                this.getStudents();
                console.log("Callback after delete student for id: " + p.id);
            }, 
            error => {
                this.handleError(error, this.HTMLText[74]);
                // this.messageService.reportMessage(new Message(this.HTMLText[74], true));
                console.log(error);
            }
    );
}
//--------------------------------------- END OF STUDENT METHODS -----------------------------------------------------------------

//--------------------------------------- START OF SCHOOLYEAR METHODS -----------------------------------------------------------------

getSchoolyears(): Schoolyear[] {
    this.dataSource.getSchoolyears().subscribe(
        data => {
            this.schoolyears = data;
            localStorage.setItem('schoolyears',JSON.stringify(this.schoolyears));
            return this.schoolyears;
        },
        error => {
            this.handleError(error, this.HTMLText[75]);
            // this.messageService.reportMessage(new Message(this.HTMLText[75], true))
            this.loginFailed.next("login failed");
        }
    );

    return this.schoolyears;
}

getSchoolyearsFromRAM() : Schoolyear[]{
    return this.schoolyears;
}

getClassSchoolyearsFromRAM() : Class_schoolyear[]{
    this.classSchoolyears = JSON.parse(localStorage.getItem('teachers'));
    return this.classSchoolyears;
}

//--------------------------------------- END OF SCHOOLYEAR METHODS -----------------------------------------------------------------

//--------------------------------------- START OF CLASSSCHOOLYEAR METHODS -----------------------------------------------------------------

getClassSchoolyearsBySchoolyear(): Class_schoolyear[] {
    // let currentCSid = JSON.parse(localStorage.getItem('currentSchoolyearId'));
    let currentCSid = JSON.parse(localStorage.getItem('currentSchool'))[0]["schoolyear_filter"];

    // this.dataSource.getClassSchoolyearBySchoolyear(this.currentSchoolyearId).subscribe(
        this.dataSource.getClassSchoolyearBySchoolyear(currentCSid).subscribe(
        data => {
            this.classSchoolyears = data["data"];
            localStorage.setItem('classSchoolyears', JSON.stringify(this.classSchoolyears));
            this.classSchoolyearsLoaded.next(this.classSchoolyears);
//            return this.classSchoolyears;
        },
        error => {
            this.handleError(error, this.HTMLText[76]);
            // this.messageService.reportMessage(new Message(this.HTMLText[76], true));
            console.log(error);
        }
    );

    return this.classSchoolyears;
}

addClassSchoolyear(cs: Class_schoolyear) {
    this.dataSource.addClassSchoolyear(cs).subscribe(
        data => {
            this.getClassSchoolyearsBySchoolyear();
            this.messageService.reportMessage(new Message("Class added", false));
            return data;
        },
        error => {
            this.messageService.reportMessage(new Message("Error adding class", true));
            console.log("error adding classschoolyear");
        }
    )
}

editClassSchoolyear(cs: Class_schoolyear){
    this.dataSource.editClassSchoolyear(cs).subscribe(
        data => {
            this.getClassSchoolyearsBySchoolyear();
            this.messageService.reportMessage(new Message("Class updated", false));
            return data;
        },
        error => {
            this.messageService.reportMessage(new Message("Error updating class", true));
            console.log("error adding classschoolyear");
        }
    )
}

deleteClassSchoolyear(csId: number){
    this.dataSource.deleteClassSchoolyear(csId).subscribe(
        data => {
            this.getClassSchoolyearsBySchoolyear();
            this.messageService.reportMessage(new Message("Class deleted", false));
            return data;
        },
        error => {
            this.messageService.reportMessage(new Message("Error deleting class", true));
            console.log("error adding classschoolyear");
        }
    )
}

//--------------------------------------- END OF CLASSSCHOOLYEAR METHODS -----------------------------------------------------------------


//--------------------------------------- START OF SCHOOL METHODS -----------------------------------------------------------------

getCurrentSchool(externalcode: string): School{
    this.dataSource.getSchoolInfoByExternalCode(externalcode).subscribe(
        data => {
            this.currentSchool = data;
            console.log(this.currentSchool);
            return this.currentSchool;
        },
        error => {
            this.handleError(error, this.HTMLText[77]);
            // this.messageService.reportMessage(new Message(this.HTMLText[77], true))
            this.loginFailed.next("login failed");
        }
    );

    return this.currentSchool;
}

getCurrentSchoolFromRAM(): School{
    return this.currentSchool;
}

updateSchoolLanguage(language: string, schoolId: number): School{
    this.dataSource.updateSchoolLanguage(language,schoolId).subscribe(
        data => {
            this.currentSchool = data;
            localStorage.setItem('currentSchool', JSON.stringify(this.currentSchool));
            localStorage.setItem('language',data.language.toString());
            this.messageService.reportMessage(new Message(this.HTMLText[80], false));
            return this.currentSchool;
        },
        error => {
            this.handleError(error, this.HTMLText[78]);
            // this.messageService.reportMessage(new Message(this.HTMLText[78],true));
        }
    );

    return this.currentSchool;
}

updateSchoolyearfilter(filter: number, schoolId: number): School{
    this.dataSource.updateSchoolyearfilter(filter,schoolId).subscribe(
        data => {
            this.currentSchool = data;
            localStorage.setItem('currentSchool', JSON.stringify(this.currentSchool));
            localStorage.setItem('currentSchoolyearId', data.schoolyear_filter.toString());
            this.schoolyearFilterUpdated.next("updated");
            this.messageService.reportMessage(new Message(this.HTMLText[80], false));
            return this.currentSchool;
        },
        error => {
            this.handleError(error, this.HTMLText[79]);
            // this.messageService.reportMessage(new Message(this.HTMLText[79],true));
        }
    );

    return this.currentSchool;
}

//--------------------------------------- END OF SCHOOL METHODS -----------------------------------------------------------------

//--------------------------------------- START OF LOGIN METHODS -----------------------------------------------------------------

login(username: string, password: string, schoolcodeexternal: string){
    localStorage.clear();
    //this.dataSource.getSchoolInfoByExternalCode(schoolcodeexternal).subscribe(
        console.log('first login 1234');
        this.dataSource.getCSRFToken().subscribe(
        data => {
            console.log('csrf token returned');
            this.dataSource.getSchoolInfoByExternalCode(schoolcodeexternal).subscribe(
                data2 => {
                    this.currentSchool = data2;
                    console.log(this.currentSchool);
                    localStorage.setItem('currentSchool',JSON.stringify(this.currentSchool));
                    // // this.dataSource.setSchoolcodeInternal(this.currentSchool.schoolcodeInternal);
                    // this.currentSchoolyearId = this.currentSchool.schoolyear_filter;
                    // localStorage.setItem('currentSchoolyearId',this.currentSchoolyearId.toString());
                    this.language = this.currentSchool[0].language;
                    localStorage.setItem('language',this.language);
                    localStorage.setItem('schoolcode',this.currentSchool[0].smartschoolplatform);
                    this.getLanguageText(this.language);
                    this.dataSource.login(username,password,'msninove').subscribe(
                        data1 => {
                            this.accessToken = data1.accessToken;
                            localStorage.setItem('accessToken',this.accessToken);
                            localStorage.setItem('email',username);
                            console.log(this.accessToken);
                            //console.log(this.getLoggedInUser());
                            //this.getRankingSettings();
                            // this.getLanguageText(this.language);
                            // this.getStudents();
                            // //ONLY LOAD TEACHERS IF USER IS ADMIN -> happens in getUser method
                            // // this.getTeachers();
                            // this.getSchoolyears();
                            // this.getClassSchoolyears();
                            // this.getRemarkOptions();
                            //this.getUser(username);

                            this.getUser(username);
        //                    this.messageService.reportMessage(new Message("Hi, " + " you are logged in.",false));
                        },
                        error => {
                            this.messageService.reportMessage(new Message(this.HTMLText[81],true));
                            this.loginFailed.next("login failed");
                        }    
                    );
                }
            )
        },
        error => {
 //           this.messageService.reportMessage(new Message("Error getting current school",true));
            this.messageService.reportMessage(new Message(this.HTMLText[81],true));
            console.log(error);
            this.loginFailed.next("login failed");
        }
    );
}

logout(){
    this.dataSource.logout().subscribe(
        data => {
            this.messageService.reportMessage(new Message("You are logged out now!", false));
        },
        error => {
            this.messageService.reportMessage(new Message("Error logging out",true));
            console.log(error);
        }
    )
}

getLoggedInUser(){
    this.dataSource.getLoggedInUser().subscribe(
        data => {
            localStorage.setItem('currentUser', JSON.stringify(data));
            console.log(data);
            console.log("User set in localStorage.");
            console.log(localStorage.getItem('currentUser'));

            if(JSON.parse(localStorage.getItem('currentUser')).role == 0){
                console.log(JSON.parse(localStorage.getItem('currentUser')).role);
                console.log('logged in user is a student');
                // console.log(this.getStudents());
                // this.getSchoolyears();
                // this.getClassSchoolyearsBySchoolyear();
                // this.getRemarkOptions();
                // this.getRankingSettings(); //Moved one level up for students also
            }
        }
    );
}

getUser(username: string){
    // this.dataSource.getUserByUsername(username).subscribe(
        this.dataSource.getLoggedInUser().subscribe(
        data => {
            localStorage.setItem('currentUser', JSON.stringify(data));

            console.log("User set in localStorage.");
            console.log(localStorage.getItem('currentUser'));

            //If it is a parent logging in, set the username of his/her child in localStorage
            if(JSON.parse(localStorage.getItem('currentUser')).role == 2) {
                this.getChildByParentId(JSON.parse(localStorage.getItem('currentUser')).id);
            }
 //           localStorage.getItem('currentUser');

            //TEST IF USER IS ACTIVE --> DOING THIS CLIENT SIDE IS UNSAFE, since user might change false to true on client!!           
            // if(JSON.parse(localStorage.getItem('currentUser')).active == false){
            //     this.loginFailed.next("login failed");
            // }
            // else{
                //ONLY LOAD IF USER IS TEACHER OR ADMIN
                console.log('rol' + JSON.parse(localStorage.getItem('currentUser')).role);
                if(JSON.parse(localStorage.getItem('currentUser')).role > 2){
                    console.log(JSON.parse(localStorage.getItem('currentUser')).role);
                    this.getStudents();
                    // this.getSchoolyears();
                    this.getClassSchoolyearsBySchoolyear();
                    this.getRemarkOptions();
                    this.getRankingSettings(); //Moved one level up for students also
                }

                //ONLY LOAD TEACHERS IF USER IS ADMIN
                if(JSON.parse(localStorage.getItem('currentUser')).role == 4){
                    this.getTeachers();
                    this.getParents();
                }

                this.messageService.reportMessage(new Message(this.HTMLText[82] + JSON.parse(localStorage.getItem('currentUser')).firstName + this.HTMLText[83],false));
                this.studentLoggedIn.next("Logged in user stored.");
                // this.router.navigate(['overview']);
            // }
        },
        error => {
//            this.messageService.reportMessage(new Message("Error getting user",true));
            console.log("error in getting user");
            console.log(error);
            this.loginFailed.next("login failed"); 
        }
    )

    
}

//--------------------------------------- END OF LOGIN METHODS -----------------------------------------------------------------

//--------------------------------------- START OF REMARKOPTIONS METHODS -----------------------------------------------------------------

getRemarkOptions(){
    this.dataSource.getRemarkoptions().subscribe(
        data =>{
            localStorage.setItem('remarkoptions', JSON.stringify(data["data"]));
            this.remarkoptionChangeDetected.next('remarkoptions changed');
        },
        error => {
            this.handleError(error, this.HTMLText[84]);
            // this.messageService.reportMessage(new Message(this.HTMLText[84], true))
            this.loginFailed.next("loading remarkoptions failed");
        }
    );
}

addRemarkoption(remarkoption: Remarkoptions){
    this.dataSource.addRemarkoption(remarkoption).subscribe(
        data => {
            this.messageService.reportMessage(new Message(this.HTMLText[85],false));
            this.getRemarkOptions();
        } ,
        error => {
            this.handleError(error, this.HTMLText[86]);
            // this.messageService.reportMessage(new Message(this.HTMLText[86],true));
        } 
    );
}

editRemarkoption(remarkoption: Remarkoptions){
    this.dataSource.editRemarkoption(remarkoption).subscribe(
        data => {
            this.messageService.reportMessage(new Message(this.HTMLText[87],false));
            this.getRemarkOptions();
        } ,
        error => {
            this.handleError(error, this.HTMLText[88]);
            // this.messageService.reportMessage(new Message(this.HTMLText[88],true));
        } 
    );
}

deleteRemarkoption(remarkoption: Remarkoptions){
    this.dataSource.deleteRemarkoption(remarkoption).subscribe(
        data => {
            this.messageService.reportMessage(new Message(this.HTMLText[89],false));
            this.getRemarkOptions();
        } ,
        error => {
            this.handleError(error, this.HTMLText[90]);
            // this.messageService.reportMessage(new Message(this.HTMLText[90],true));
        } 
    );
}

//--------------------------------------- END OF REMARKOPTIONS METHODS -----------------------------------------------------------------

//--------------------------------------- START OF PASSWORDFORGOT METHODS -----------------------------------------------------------------



forgotpassword1(email: string, schoolcodeexternal: string){
    localStorage.clear();
    localStorage.setItem("NoSuchUserError","0");
    localStorage.setItem("NoSuchSchoolcode","0");
    this.dataSource.getSchoolInfoByExternalCode(schoolcodeexternal).subscribe(
        data => {
            if(data != null){
                this.currentSchool = data;
                console.log(this.currentSchool);
                localStorage.setItem('currentSchool',JSON.stringify(this.currentSchool));
                this.dataSource.forgotpassword1(email).subscribe(
                    data => {
                        this.messageService.reportMessage(new Message(this.HTMLText[152], false));
                    },
                    error => {
                        console.log(error.error.text);
                        // if(error.error.text == "MailError"){
                        //     localStorage.setItem('MailError',"1");
                        //     this.messageService.reportMessage(new Message("Fout bij het versturen van de mail.", true));
                        // }
                        // if(error.error.text == "NoSuchUserError"){
                        //     localStorage.setItem("NoSuchUserError","1");
                        //     this.messageService.reportMessage(new Message("Er werd geen gebruiker met dit e-mailadres gevonden.", true));
                        // }
                        this.handleError(error,"Oops, something went wrong! Please try again.")
                        // this.messageService.reportMessage(new Message(error.error, true));
                    }
                );
            }
            else {
                // localStorage.setItem("NoSuchSchoolcode","1");
                this.messageService.reportMessage(new Message(this.HTMLText[150], true));
                // this.handleError("NoSuchSchoolcode","");
            }
        },
        error => {
            this.messageService.reportMessage(new Message(this.HTMLText[151], true));
            console.log(error.error);
        })
}

forgotpassword2(code: string, schoolcode: string, newpw: string){
    localStorage.clear();
    localStorage.setItem("NoSuchUserError","0");
    localStorage.setItem("NoSuchSchoolcode","0");
    this.dataSource.forgotpassword2(code, schoolcode, newpw).subscribe(
        data => {
            this.messageService.reportMessage(new Message("Je wachtwoord is gewijzigd.", false));
        },
        error => {
            console.log(error);
            this.handleError(error,"Oops, something went wrong. Please try again.");
            // if(error.error.text == "NoSuchUserError"){
            //     localStorage.setItem("NoSuchUserError","1");
            //     this.messageService.reportMessage(new Message("Er werd geen gebruiker met dit e-mailadres gevonden.", true));
            // }
            // if(error.error.text == "NoSuchSchoolcode"){
            //     localStorage.setItem("NoSuchSchoolcode","1");
            //     this.messageService.reportMessage(new Message("Deze schoolcode werd niet gevonden.", true));
            // }
        }
    )

}

//--------------------------------------- END OF PASSWORDFORGOT METHODS -----------------------------------------------------------------


//--------------------------------------- START OF REMARK METHODS -----------------------------------------------------------------

saveRemarks(remarks: RemarksSaveForm){
    this.dataSource.saveRemarks(remarks).subscribe(
        data => {
            if(!this.HTMLText){
                this.HTMLText = JSON.parse(localStorage.getItem('multiLangText'));
            }
            this.messageService.reportMessage(new Message(remarks.studentId.length + " " + this.HTMLText[91],false));
            this.remarksSaved.next('remarks saved');
            console.log("remarks saved.");
        },
        error => {
            this.handleError(error, this.HTMLText[92]);
            // this.messageService.reportMessage(new Message(this.HTMLText[92],true));
            console.log("error saving remarks");
        }
    );
}

getFilteredRemarks(remarksFilter: RemarkFilterForm){
    this.dataSource.getFilteredRemarks(remarksFilter).subscribe(
        data => {
            console.log("remarksfilter");
            console.log(remarksFilter);
            this.filteredRemarks = data["data"];
            console.log("filtered remarks:");
            console.log(this.filteredRemarks);
            this.filteredRemarksArrived.next(this.filteredRemarks);
        },
        error => {
            console.log(error.error.error);
            console.log("error getting filtered remarks.");
            this.handleError(error,"error getting filtered remarks");
        }
    );
}

getStudentsOwnFilteredRemarks(remarksFilter: RemarkFilterForm){
    this.dataSource.getStudentsOwnFilteredRemarks(remarksFilter).subscribe(
        data => {
            this.filteredRemarks = data;
            this.filteredRemarksArrived.next(data);
        },
        error => {
            console.log(error.error.error);
            console.log("error getting filtered remarks.");
            this.handleError(error,"error getting filtered remarks");
        }
    );
}

deleteRemark(remarkId: number){
    this.dataSource.deleteRemark(remarkId).subscribe(
        data => {
            if(this.HTMLText){
                this.messageService.reportMessage(new Message(this.HTMLText[89],false));
            }
            this.remarkDeleted.next('remark deleted');
            console.log("remark deleted");
        },
        error => {
            this.handleError(error, this.HTMLText[90]);
            // this.messageService.reportMessage(new Message(this.HTMLText[90],true));
            console.log("error deleting remark");
            console.log(error);
        }
    )
}

//--------------------------------------- END OF REMARK METHODS -----------------------------------------------------------------


//--------------------------------------- START OF PASSWORD METHODS -----------------------------------------------------------------

validatePassword(editPasswordForm: EditPasswordForm){
    console.log("entering validatePassword");
    console.log(editPasswordForm);
    this.dataSource.validatePassword(editPasswordForm).subscribe(
        data => {
            console.log("data in succes validatePassword in model: ");
            console.log(data);
            console.log(editPasswordForm);
            this.passwordValid.next(true);
            // this.passwordValid.next(data);
//            return true;
        },
        error => {
            console.log("data in error validatePassword in model with error: ");
            console.log(editPasswordForm);
            this.messageService.reportMessage(new Message(this.HTMLText[93],true));
            this.passwordValid.next(false);
//            return false;
        }
    );
//    return false;
}

//--------------------------------------- END OF PASSWORD METHODS -----------------------------------------------------------------

//--------------------------------------- START OF MULTILANGUAGE METHODS -----------------------------------------------------------------


getLanguageText(langcode: string) {
    this.dataSource.getLanguageText(langcode).subscribe(
        data => {
            localStorage.setItem('multiLangText', JSON.stringify(data["data"]));
            this.HTMLText = JSON.parse(localStorage.getItem('multiLangText'));
            // console.log(data);
            this.HTMLTextLoaded.next(data);
        },
        error => {
            this.messageService.reportMessage(new Message(this.HTMLText[94], true))
            this.loginFailed.next("login failed");
        }
    )
}

//--------------------------------------- END OF MULTILANGUAGE METHODS -----------------------------------------------------------------

//--------------------------------------- START OF SIGNUP SCHOOL METHODS -----------------------------------------------------------------

updateSchoolInfo(signupSchool: SignupSchool){
    this.dataSource.updateSchoolInfo(signupSchool).subscribe(
        data=>{
            console.log(data);
            this.schoolInfoUpdated.next(data);
        },
        error => {
            console.log(error.error);
        }
    )
}

confirmadmin(admin: SignupUser, confirmationuid: string, schoolcodeInternal: string){
    this.dataSource.confirmadmin(admin, confirmationuid, schoolcodeInternal).subscribe(
        data => {
            console.log(data);
            this.adminCreated.next(data);
        },
        error => {
            console.log(error);
        }
    )
}

confirmadmin2(schoolcodeInternal: string, confirmationuid: string){
    this.dataSource.confirmadmin2(schoolcodeInternal, confirmationuid).subscribe(
        data => {
            console.log(data);
            this.adminConfirmed.next(data);
        },
        error => {
            this.messageService.reportMessage(new Message("Oops! It seems like something went wrong. \nPlease contact our helpdesk.", true));
            console.log(error);
            this.adminConfirmed.next(error.error);
        }
    )
}

//--------------------------------------- END OF SIGNUP SCHOOL METHODS -----------------------------------------------------------------

//--------------------------------------- START OF RANKING METHODS -----------------------------------------------------------------

updateRanking(){
   this.dataSource.updateRanking().subscribe(
    data => {
        console.log("Rankings updated!")
    },
    error => {
        console.log("ERROR updating rankings");
    }
   )
}

getAllRankings(){
    this.dataSource.getAllRankings().subscribe(
        data => {
            console.log("All rankings loaded");
            this.allRankingsLoaded.next(data);
        },
        error => {
            console.log("Error loading all rankings");
            this.messageService.reportMessage(new Message("Error loading all ranking", true));
        }
    )
}

getRankingsSortedByClass(){
    this.dataSource.getRankingsSortedByClass().subscribe(
        data => {
            console.log("All rankings sorted by class loaded");
            this.allRankingsLoaded.next(data);
        },
        error => {
            console.log("Error loading all rankings");
            this.messageService.reportMessage(new Message("Error loading all rankings ordered by class", true));
        }
    )
}

getClassRankings(classId: number){
    this.dataSource.getClassRankings(classId).subscribe(
        data => {
            console.log("Class rankings loaded");
             this.rankingSettingsLoaded.next(data);
            //this.classRankingsLoaded.next(data);
        },
        error => {
            console.log("Error loading class rankings");
            this.messageService.reportMessage(new Message("Error loading class ranking", true));
        }
    )
}


getRankingSettings(){
    this.dataSource.getRankingSettings().subscribe(
        data => {
            let rankingSettings = data['data'][0];
            console.log("Rankingsettings loaded");
            localStorage.setItem("rankingSettings", JSON.stringify(rankingSettings));
            //this.rankingSettingsLoaded.next(data);
            this.classRankingsLoaded.next(rankingSettings);
        },
        error => {
            console.log("Error loading class rankings");
        }
    )
}

updateRankingSettings(settings: RankingSettings) {
    this.dataSource.updateRankingSettings(settings).subscribe(
        data => {
            console.log("Rankingsettings updated");
            this.rankingSettingsUpdated.next(data);
            localStorage.setItem("rankingSettings", JSON.stringify(data));
        },
        error => {
            console.log("Error updating ranking settings");
        }
    )
}

//--------------------------------------- END OF RANKING METHODS -----------------------------------------------------------------


handleError(error, message: string){
    if(error.error.text == "MailError"){
        // localStorage.setItem('MailError',"1");
        this.messageService.reportMessage(new Message("Fout bij het versturen van de mail.", true));
    }
    if(error.error.text == "NoSuchUserError"){
        // localStorage.setItem("NoSuchUserError","1");
        this.messageService.reportMessage(new Message("Er werd geen gebruiker met dit e-mailadres gevonden.", true));
    }
    if(error.error.text == "NoSuchSchoolcode"){
        // localStorage.setItem("NoSuchSchoolcode","1");
        this.messageService.reportMessage(new Message("Deze schoolcode werd niet gevonden.", true));
    }
    if(error.error.error == "Unauthorized"){
        this.messageService.reportMessage(new Message("Oops! It seems like something went wrong. Please sign in to access this page.", true));
        this.router.navigate(['login']);
    }
    if(message != ""){
        this.messageService.reportMessage(new Message(message, true));
    }
}

}