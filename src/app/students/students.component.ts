import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {formatDate} from '@angular/common';

import { Student } from "../model/student.model";
import { SignupUser } from "../model/signupUser.model";
import { Model } from "../model/repository.model";
import { Schoolyear } from '../model/schoolyear.model';
import { Class_schoolyear } from '../model/class_schoolyear.model';

import { FileUtil }                     from '../csvutils/file.util';
import { Constants }                    from '../csvutils/tests.constants';

import { refreshDescendantViews } from '@angular/core/src/render3/instructions';
import { ActivatedRoute, Router } from '@angular/router';

import { Document, Paragraph, Packer, TextRun, BorderStyle } from "docx";
import { WidthType } from "docx";
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  students: Student[];
  signUp: SignupUser;
  signUps: SignupUser[] = [];
  toEdit: Student;
  editedStudent: Student;
  toDelete: Student;
  csvContent: string;
  parsedCsv: string[][];
  test: string;
  schoolyears: Schoolyear[];
  classSchoolyears: Class_schoolyear[];
  passwordsMatch: boolean;

  csvRecords = [];

  addForm: FormGroup;
  editForm: FormGroup;
  passwordForm: FormGroup;
  classForm: FormGroup;

 // currentSchoolyear: Schoolyear;

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
//    this.currentSchoolyear = this.initCurrentSchoolyear();
    this.parsedCsv = [];
    // this.students = this.model.getStudents();
    // this.schoolyears = this.model.getSchoolyears();
    // this.classSchoolyears = this.model.getClassSchoolyears();

    // if( this.model.getStudentsFromRAM().length > 0){
    //   this.students = this.model.getStudentsFromRAM();
    // }
    // else{
    //   this.students = this.model.getStudents();
    // }
    // this.students = JSON.parse(localStorage.getItem('students'));
    
    // if( this.model.getClassSchoolyearsFromRAM().length > 0){
    //   this.classSchoolyears = this.model.getClassSchoolyearsFromRAM();
    // }
    // else{
    //   this.classSchoolyears = this.model.getClassSchoolyears();
    // }

    // if( this.model.getSchoolyearsFromRAM().length > 0){
    //   this.schoolyears = this.model.getSchoolyearsFromRAM();
    // }
    // else{
    //   this.schoolyears = this.model.getSchoolyears();
    // }

    if( localStorage.getItem('schoolyears')){
      this.schoolyears = JSON.parse(localStorage.getItem('schoolyears'));
      console.log("logging schoolyears");
      console.log("äébà");
      console.log(JSON.parse(localStorage.getItem('schoolyears')));
    }
    else{
      this.schoolyears = this.model.getSchoolyears();
    }

    if( localStorage.getItem('classSchoolyears')){
      this.classSchoolyears = JSON.parse(localStorage.getItem('classSchoolyears'));
      console.log("logging classSchoolyears");
      console.log(JSON.parse(localStorage.getItem('classSchoolyears')));
    }
    else{
      // this.classSchoolyears = this.model.getClassSchoolyears();
      // if(localStorage.getItem('currentSchoolyearId')){
        this.classSchoolyears = this.model.getClassSchoolyearsBySchoolyear();
      // }
    }

    // this.model.classSchoolyearsLoaded.subscribe(
    //   data => {
    //     this.classSchoolyears = JSON.parse(localStorage.getItem('classSchoolyears'));
    //     console.log("data arrived");
    //     console.log(this.classSchoolyears[0].schoolClass);
    //   }
    // );

    // this.schoolyears = JSON.parse(localStorage.getItem('schoolyears'));
    this.classSchoolyears = this.model.getClassSchoolyearsFromRAM();

    this.signUp = { }; 
    console.log(this.students);

    this.toEdit ={};

    this.initForms();

    if( localStorage.getItem('students')){
      this.students = JSON.parse(localStorage.getItem('students'));
    }
    else{
      this.students = this.model.getStudents();
    }
  
    this.model.studentsChangeDetected.subscribe(
      (message: String) => {
        // console.log("studentschangedetected in addremark. Students updated.")
        // console.log(localStorage.getItem('students').toString());
        // this.allStudents = JSON.parse(localStorage.getItem('students'));
        this.students = JSON.parse(localStorage.getItem('students'));
      });
    
    // this.model.studentsChangeDetected.subscribe(
    //   (data: []) => {
    //     // this.students = this.model.getStudentsFromRAM();
    //     console.log(this.students);
    //     this.students = JSON.parse(localStorage.getItem('students'));
    //     //this.students = data;
    //     this.classSchoolyears = this.model.getClassSchoolyearsFromRAM();
    //     this.schoolyears = this.model.getSchoolyearsFromRAM();
    //   })
  }

  // ngDoCheck() {
  //   // this.refresh();
  // }

  refresh(){
    this.students = this.model.getStudents();
    // this.students = this.model.getStudentsFromRAM();
    // console.log(this.students);
  }

  getSchoolyears(){
    if( localStorage.getItem('classSchoolyears')){
      this.classSchoolyears = JSON.parse(localStorage.getItem('classSchoolyears'));
      console.log("logging classSchoolyears");
      console.log(JSON.parse(localStorage.getItem('classSchoolyears')));
    }
    else{
      // this.classSchoolyears = this.model.getClassSchoolyears();
      // if(localStorage.getItem('currentSchoolyearId')){
        this.classSchoolyears = this.model.getClassSchoolyearsBySchoolyear();
      // }
    }
    // this.schoolyears = this.model.getSchoolyearsFromRAM();
    // if( this.model.getClassSchoolyearsFromRAM()){
    //   this.classSchoolyears = this.model.getClassSchoolyearsFromRAM();
    // }
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
        this.signUp.role = 1;
        // this.signUp.roles = [
        //   {
        //       "id": 1,
        //       "name": "ROLE_STUDENT1"
        //   }
        // ];
        
        // this.signUp.classSchoolyears = [];
        // this.signUp.classSchoolyears = this.getClassSchoolyearById(this.addForm.get('class').value);
        // this.signUp.classSchoolyears = this.getClassSchoolyearById(this.addForm.get('class').value);
        this.signUp.class1_id = this.addForm.get('class').value;
        console.log("this.signUp: ");
        console.log(this.signUp);

//         this.signUp.error = "";
//         this.signUp.schoolClass = "";
//         this.signUp.schoolyear = {
//           id: 1,
//           schoolyear: "2017-2018"
//  //       };
//         };
        this.addForm.setValidators(this.passwordMatchValidator);
        this.addForm.updateValueAndValidity();
        if (this.addForm.valid) {
          console.log("AddForm is valid");
          this.model.signUpStudent(this.signUp);
          this.addForm.reset();
        }
        else {
          console.log("There is still an error in the form");
        }
//    this.refresh();
  }

  // getClassSchoolyearByItsId(id): Class_schoolyear {
  //   return this.classSchoolyears.find(x => x.class_schoolyear_id === id);
  // }

  getCurrentSchoolyearText(): string {
    if(localStorage.getItem('currentSchoolyearId')){
      return this.schoolyears.find(x => x.id === JSON.parse(localStorage.getItem('currentSchoolyearId'))).schoolyear;
    }
    return "null";
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
    this.editForm.reset();
    this.passwordForm.reset();
    this.classForm.reset();
    this.getSchoolyears();
    console.log(i);
    this.toEdit = this.model.getStudent(i);
    console.log(this.toEdit);
    console.log('classSchoolyears in model:');
    console.log(this.model.getClassSchoolyearsFromRAM());
    console.log('class value in html: ');
    console.log(this.classForm.get('class').value);
    console.log("toEdit class_schoolyear_id" + this.toEdit.class1_id);
    this.editForm.setValue({
      // schoolClass: this.getClassSchoolyearById(this.toEdit.classSchoolyears[0].class_schoolyear_id),
      lastname: this.toEdit.lastName,
      firstname: this.toEdit.firstName,
      email: this.toEdit.email,
      active: this.toEdit.active
    });
    this.classForm.setValue({
      class: this.toEdit.class1_id
    });
  }

  onDelete(i: number){
    console.log(i);
    this.toDelete = this.model.getStudent(i);
  }

  onDeleteFinal(){
    this.model.deleteStudent(this.toDelete.id);
    this.toDelete = {}; 
  }

  saveEditedUser(){
    this.editedStudent = this.toEdit;
    this.editedStudent.firstName = this.editForm.get('firstname').value;
    this.editedStudent.lastName = this.editForm.get('lastname').value;
    this.editedStudent.username = this.editForm.get('email').value;
    this.editedStudent.email =  this.editForm.get('email').value;
    this.editedStudent.active = this.editForm.get('active').value;

    console.log(this.editedStudent);
    this.model.updateStudentInfo(this.editedStudent);
    this.toEdit={};
  }

  saveEditedPassword(){
    this.model.updateStudentPassword(
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

  saveEditedClass(){
    // this.toEdit.class1_id = this.getClassSchoolyearById(this.classForm.get('class').value);
    this.toEdit.class1_id = this.classForm.get('class').value;
    this.model.updateStudent(this.toEdit);
    this.toEdit={};
  }

  //OLD CODE -- NO LONGER NEEDE
  // private getClassSchoolyearById(id: number): Class_schoolyear[]{
  //   for(var i=0; i<this.classSchoolyears.length;i++){
  //     console.log("this.classSchoolyears[i].class_schoolyear_id: " + this.classSchoolyears[i].class_schoolyear_id);
  //     console.log("this.addForm.get('class').value: " + id);

  //     if(this.classSchoolyears[i].class_schoolyear_id == id){
  //       return [{
  //         "class_schoolyear_id": this.classSchoolyears[i].class_schoolyear_id,
  //         "schoolClass": this.classSchoolyears[i].schoolClass,
  //         "schoolyear_id": this.classSchoolyears[i].schoolyear_id
  //       }
  //     ]
  //     }//end of if
  //   }//end of for
  // }

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
        // headerLength = headersRow.length; 
        headerLength = 6;
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

  createBulkAccounts(){
    console.log("Entering createBulkAccounts...");
    console.log(this.csvRecords);
    // console.log(this.model.parsedCsv);
    // console.log("test: " + this.test);
    this.signUps = [];
    let i=0;
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
          newSignUp.role = 1;
          // newSignUp.roles = [
          //   {
          //       "id": 1,
          //       "name": "ROLE_STUDENT1"
          //   }
          // ];
          newSignUp.class1_id = line[5];
          // newSignUp.classSchoolyears = this.getClassSchoolyearById(line[5]);
          // newSignUp.error = "";
//          newSignUp.schoolClass = "";
//          newSignUp.schoolyear = {
          //   id: 1, 
          //   schoolyear: "2017-2018"
          // }
          this.model.signUpStudentNoGetStudents(newSignUp);
          // if(i == (this.csvRecords.length-1)){
          //   this.model.getStudents();
          // }
          // i++;
//USE THIS TO SIGNUP MULTIPLE WITH ONE METHOD (NOT WORKING!)
 //         this.signUps.push(newSignUp);
//          this.model.signUpStudent(newSignUp);
          //console.log(newSignUp);
    })
//USE THIS ALSO TO SIGNUP MULTIPLE WITH ONE METHOD (NOT WORKING!)
    //        this.model.signUpStudents(this.signUps);
    this.refresh();   
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
  createHeading(text) {
    return new Paragraph(text).heading1().thematicBreak();
  }


  downloadWord(){
    var document = new Document();
    // document.addParagraph(new Paragraph("Rapport opmerkingen").title());
    document.addParagraph(this.createHeading("Klascodes (" + this.getCurrentSchoolyearText() + ")"));
    document.addParagraph(new Paragraph().addRun(new TextRun("Gegenereerd op: " + new Date().toLocaleString()).bold().break()));
 
    const table = document.createTable(this.classSchoolyears.length + 1, 2);
    table.getRow(0).getCell(0).CellProperties.setWidth(20, WidthType.PERCENTAGE);
    table.getRow(0).getCell(1).CellProperties.setWidth(25, WidthType.PERCENTAGE);
    table.getRow(0).getCell(0).addContent(new Paragraph("code"));
    table.getRow(0).getCell(0).addContent(new Paragraph("klas"));
 
    for(var i=0; i< this.classSchoolyears.length; i++){
      table.getRow(i+1).getCell(0).addContent(new Paragraph(this.classSchoolyears[i].id.toString()));
      table.getRow(i+1).getCell(1).addContent(new Paragraph(this.classSchoolyears[i].class1));
    }
    
    const packer = new Packer();

    packer.toBlob(document).then(blob => {
      console.log(blob);
      FileSaver.saveAs(blob, "classcodes.docx");
      console.log("Document created successfully");
    });
  }

  private initForms(){
    this.addForm = this.formBuilder.group ({
      class: ['', Validators.required],
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordagain: ['', Validators.required],
      active: ['']
    });
    this.addForm.setValidators(this.passwordMatchValidator);

    this.editForm = this.formBuilder.group ({
      // schoolClass: ['', Validators.required],
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', Validators.required],
      active: ['']
    })
  
    this.passwordForm = this.formBuilder.group ({
      password: ['', Validators.required],
      passwordagain: ['', Validators.required]
    })
    this.passwordForm.setValidators(this.passwordMatchValidator);

    this.classForm = this.formBuilder.group ({
      class: ['', Validators.required]
    })
  }

}
