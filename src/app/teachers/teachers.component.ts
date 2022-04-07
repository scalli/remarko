import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {formatDate} from '@angular/common';

import { Teacher } from "../model/teacher.model";
import { SignupUser } from "../model/signupUser.model";
import { Model } from "../model/repository.model";

import { FileUtil }                     from '../csvutils/file.util';
import { Constants }                    from '../csvutils/tests.constants';

import { refreshDescendantViews } from '@angular/core/src/render3/instructions';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {

  teachers: Teacher[];
  signUp: SignupUser;
  signUps: SignupUser[] = [];
  toEdit: Teacher;
  editedTeacher: Teacher;
  toDelete: Teacher;
   csvContent: string;
  parsedCsv: string[][];
  test: string;
  csvRecords = [];
  passwordsMatch: boolean;

  addForm: FormGroup;
  editForm: FormGroup;
  passwordForm: FormGroup;

  HTMLtext;

  constructor(
    private model: Model,
    private formBuilder: FormBuilder,
    private _fileUtil: FileUtil,
    activeRoute: ActivatedRoute,
    private router: Router) { 
  }

  ngOnInit() {    
    this.HTMLtext = JSON.parse(localStorage.getItem('multiLangText'));
    this.parsedCsv = [];
    // this.teachers = this.model.getTeachers();
    // if( this.model.getTeachersFromRAM().length > 0){
    //   this.teachers = this.model.getStudentsFromRAM();
    // }
    // else{
    //   this.teachers = this.model.getTeachers();
    // }
    this.teachers = JSON.parse(localStorage.getItem('teachers'));
    this.signUp = { }; 
    console.log(this.teachers);

    this.toEdit ={};

    this.initForms();

    this.model.teachersChangeDetected.subscribe(
      (data: []) => {
        console.log("Now refreshing after ... ");
        // this.router.navigateByUrl("/teachers");
        // this.model.getTeachers();
        // this.teachers = this.model.getTeachersFromRAM();
        this.teachers = JSON.parse(localStorage.getItem('teachers'));
        // this.teachers = data;
      })
  }

  // ngDoCheck() {
  //   // this.refresh();
  // }

  refresh(){
    this.teachers = this.model.getTeachers();
    // this.teachers = this.model.getTeachersFromRAM();
    console.log(this.teachers);
  }

  signupUser(){
  //  for(var i=1; i<1400; i++){
        console.log("entering signupUser...");
        this.signUp.firstName = this.addForm.get('firstname').value;
        this.signUp.lastName = this.addForm.get('lastname').value;
        this.signUp.username = this.addForm.get('email').value;
        this.signUp.email =  this.addForm.get('email').value;
        this.signUp.password = this.addForm.get('password').value;
        this.signUp.active = this.addForm.get('active').value;
        this.signUp.language = "nl";
        this.signUp.lastLoginDate = "";//formatDate(new Date(), 'yyyy/MM/dd', 'en');
        this.signUp.role = 3;

        //OLD CODE
        // this.signUp.roles = [
        //   {
        //       "id": 3,
        //       "name": "ROLE_TEACHER1"
        //   }
        // ];
        //Leave class_schoolyear empty when signin up a teacher (has no class)
        // this.signUp.classSchoolyears = [];
        this.signUp.class1_id = 0;

        this.addForm.setValidators(this.passwordMatchValidator);
        this.addForm.updateValueAndValidity();
        if (this.addForm.valid) {
          console.log("AddForm is valid");
          // this.model.signUpStudent(this.signUp);
          this.model.signUpTeacher(this.signUp);
          this.addForm.reset();
        }
        else {
          console.log("There is still an error in the form");
        }
//         this.signUp.error = "";
//         this.signUp.schoolClass = "";
//         this.signUp.schoolyear = {
//           id: 1,
//           schoolyear: "2017-2018"
//  //       };
//         }
    // this.model.signUpTeacher(this.signUp);
//    this.refresh();
  }

  checkPasswordMatch(){
    console.log("checking password match... ");
    if(this.addForm.get('password').value == this.addForm.get('passwordagain').value ){
      console.log("true");
      this.passwordsMatch = true;
    }
    else {
      console.log("false");
      this.passwordsMatch = false;
    }
  }

  checkPasswordMatchEdit(){
    console.log("checking password match... ");
    if(this.passwordForm.get('password').value == this.passwordForm.get('passwordagain').value ){
      console.log("true");
      this.passwordsMatch = true;
    }
    else {
      console.log("false");
      this.passwordsMatch = false;
    }
  }

  onEdit(i: number){
    console.log(i);
    this.toEdit = this.model.getTeacher(i);
    this.editForm.setValue({
      lastname: this.toEdit.lastName,
      firstname: this.toEdit.firstName,
      email: this.toEdit.email,
      active: this.toEdit.active
    });
  }

  onDelete(i: number){
    console.log(i);
    this.toDelete = this.model.getTeacher(i);
  }

  onDeleteFinal(){
    this.model.deleteTeacher(this.toDelete.id);
    this.toDelete = {}; 
  }

  saveEditedUser(){
    this.editedTeacher = this.toEdit;
    this.editedTeacher.firstName = this.editForm.get('firstname').value;
    this.editedTeacher.lastName = this.editForm.get('lastname').value;
    this.editedTeacher.username = this.editForm.get('email').value;
    this.editedTeacher.email =  this.editForm.get('email').value;
    this.editedTeacher.active = this.editForm.get('active').value;

    console.log(this.editedTeacher);
    this.model.updateTeacherInfo(this.editedTeacher);
    this.toEdit={};
  }

  saveEditedPassword(){
    this.model.updateTeacherPassword(
      {
        id: this.toEdit.id,
        password: this.passwordForm.get('password').value
      }
    );
    this.toEdit={};
    this.passwordForm.setValue({
      password: "",
      passwordagain: ""
    });
  }

   // METHOD CALLED WHEN CSV FILE IS IMPORTED
   fileChangeListener($event): void {
 
    var text = [];
    var files = $event.srcElement.files;
 
    if(Constants.validateHeaderAndRecordLengthFlag){
      if(!this._fileUtil.isCSVFile(files[0])){
        alert("Please import valid .csv file.");
        this.fileReset();
      }
    }
 
    var input = $event.target;
    var reader = new FileReader();
    reader.readAsText(input.files[0]);
 
    reader.onload = (data) => {
      let csvData = reader.result;
      let csvRecordsArray = (<string> csvData).split(/\r\n|\n/);
 
      var headerLength = -1;
      if(Constants.isHeaderPresentFlag){
        let headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, Constants.tokenDelimeter);
//        headerLength = headersRow.length; 
        headerLength = 5; 
      }
       
      this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray, 
          headerLength, Constants.validateHeaderAndRecordLengthFlag, Constants.tokenDelimeter);
      
      console.log(this.csvRecords);    
          
      if(this.csvRecords == null){
        //If control reached here it means csv file contains error, reset file.
        this.fileReset();
      }    
    }
 
    reader.onerror = function () {
      alert('Unable to read ' + input.files[0]);
    };
  };
 
  fileReset(){
   //TODO
    //this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }


//   onFileLoad(fileLoadedEvent) {
//     const csvSeparator = ',';
//     const textFromFileLoaded = fileLoadedEvent.target.result;
//     this.csvContent = textFromFileLoaded;

//     const txt = textFromFileLoaded;
//     const csv = [];
//     const lines = txt.split('\n');
// //    console.log("lines: " + lines);
//     lines.forEach(element => {
// //      console.log("line: " + element);
//       const cols: string[] = element.split(csvSeparator);
// //      console.log("cols: " + cols);
//       csv.push(cols);
//       console.log("csv: " + csv);
//     });
//    this.parsedCsv = csv.copyWithin(0,csv.length);
// this.model.parsedCsv = [];   
// this.model.parsedCsv= csv;
//     console.log( "parsedCsv in onFileLoad: " + this.parsedCsv);

//     // demo output
//     var output: string="";
//     this.parsedCsv.forEach(row => {
//       output += "\n";
//       var colNo = 0;
//       row.forEach(col => {
//         if (colNo>0) output += " | ";
//         output += col;
//         colNo++;
//       });
//     });
//     this.test = this.parsedCsv[0][0];
//     console.log(output);
//     console.log("test: " + this.test);
//     console.log("parsedCsv: " + this.parsedCsv);
//   }

//   onFileSelect(input: HTMLInputElement) {

//     const files = input.files;
//     var content = this.csvContent;

//    if (files && files.length) {
//        /*
//         console.log("Filename: " + files[0].name);
//         console.log("Type: " + files[0].type);
//         console.log("Size: " + files[0].size + " bytes");
//         */

//         const fileToRead = files[0];

//         const fileReader = new FileReader();
//         fileReader.onload = this.onFileLoad;

//        fileReader.readAsText(fileToRead, "UTF-8");
//    }

//   }

  createBulkAccounts(){
    console.log("Entering createBulkAccounts...");
    console.log(this.csvRecords);
    // console.log(this.model.parsedCsv);
    // console.log("test: " + this.test);
    this.signUps = [];
    this.csvRecords.forEach(line => {
 //         console.log("adding new signupUser...");
          var newSignUp: SignupUser = {};
          newSignUp.firstName = line[0];
          newSignUp.lastName = line[1];
          newSignUp.username = line[2];
          newSignUp.email =  line[2];
          newSignUp.password = line[3];
          if(line[4] == "0"){
            newSignUp.active = false;
          } else {newSignUp.active = true;}
          newSignUp.language = "nl";
          newSignUp.lastLoginDate = "";//formatDate(new Date(), 'yyyy/MM/dd', 'en');
          newSignUp.role = 3;
          newSignUp.class1_id = 0;

          //OLD CODE
          // newSignUp.roles = [
          //   {
          //       "id": 3,
          //       "name": "ROLE_TEACHER1"
          //   }
          // ];
          // newSignUp.classSchoolyears = [];
          // newSignUp.error = "";
//          newSignUp.schoolClass = "";
//          newSignUp.schoolyear = {
          //   id: 1,
          //   schoolyear: "2017-2018"
          // }
          this.signUps.push(newSignUp);
          console.log(this.signUps);
//          this.model.signUpTeacher(newSignUp);
          //console.log(newSignUp);
    })
   this.model.signUpTeachers(this.signUps);
   this.csvRecords = [];
  }

    //Our own custom validator for checking password and passwordagain match
    private passwordMatchValidator(group: FormGroup): any {
      if (group) {
        // console.log("checking password match: ");
        // console.log("password: " + group.get("password").value);
        // console.log("passwordagain: " + group.get("passwordagain").value);
        if (group.get("password").value !==group.get("passwordagain").value) {
          return { notMatching : true };
        }
      }
      return null;
    }

  private initForms(){
    this.addForm = this.formBuilder.group ({
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordagain: ['', Validators.required],
      active: ['']
    });
    this.addForm.setValidators(this.passwordMatchValidator);

    this.editForm = this.formBuilder.group ({
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', Validators.required],
      active: ['']
    })
  
    this.passwordForm = this.formBuilder.group ({
      password: ['', Validators.required],
      passwordagain: ['', Validators.required]
    });
    this.passwordForm.setValidators(this.passwordMatchValidator);
  }

}
