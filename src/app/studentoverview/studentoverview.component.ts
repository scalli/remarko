import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from '@angular/router';
import { RemarkFilterForm } from '../model/remarkFilterForm.model';
import { Student } from '../model/student.model';
import { Class_schoolyear } from '../model/class_schoolyear.model';
import {formatDate} from '@angular/common';
import { Role } from '../model/role.model';
import { Document, Paragraph, Packer, TextRun, BorderStyle } from "docx";
import { WidthType } from "docx";
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-studentoverview',
  templateUrl: './studentoverview.component.html',
  styleUrls: ['./studentoverview.component.css']
})
export class StudentoverviewComponent implements OnInit {

  selectedStudent: Student;
  filterForm: FormGroup;
  selectedSchoolClass: Class_schoolyear;
  filterChangedNotApplied: boolean;

  todaysOnes: number;
  todaysTwos: number;
  todaysThrees: number;
  todaysFours: number;

  currentUserId;
  currentUserRole;
  
  filterDateFrom: string;
  filterDateTo: string;
  filterAuthorId: string;
  // private filterStudentId: string;
  filterSeverity1: boolean;
  filterSeverity2: boolean;
  filterSeverity3: boolean;
  filterSeverity4: boolean;

  today: Date;
  extraInfoSelected: string;
  displayExtraInfo: string;

  lastUpdateNotification: Date;
  showNotification: boolean;
  UNIXTimeHour: number;

  HTMLtext;
  classSchoolyears;

  filteredRemarks;

  constructor(private model: Model,
    private formBuilder: FormBuilder,
    activeRoute: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.today = new Date();
    this.UNIXTimeHour = 60*60*1000;
    this.selectedStudent = null;
    this.selectedSchoolClass = null;
    localStorage.setItem('filterText',"");
    // console.log(this.HTMLtext);

    this.HTMLtext = JSON.parse(localStorage.getItem('multiLangText'));
    this.model.HTMLTextLoaded.subscribe(
      data => {
        this.HTMLtext = JSON.parse(localStorage.getItem('multiLangText'));
      }
    )

    this.filterChangedNotApplied = false; 

    this.currentUserId = JSON.parse(localStorage.getItem('currentUser')).id;
    this.currentUserRole = JSON.parse(localStorage.getItem('currentUser')).role;

    this.selectCurrentLoggedIn();

    this.initFilterForm();
    
    this.model.filteredRemarksArrived.subscribe(
      data => {
        this.filteredRemarks = data;
        console.log(this.filteredRemarks);
        if(this.showNotification){
          this.setTodayCounts();
          this.showNotification = false;
        }
      },
      error => {
        console.log("error getting filtered remarks");
      }
    );

    this.model.classSchoolyearsLoaded.subscribe(
      data => {
        this.classSchoolyears = JSON.parse(localStorage.getItem('classSchoolyears'));
        console.log("classSchoolyears");
        console.log(this.classSchoolyears);
      }
    )

    this.model.childLoaded.subscribe(
      data => {
        this.setSelectedStudent("child");
      }
    )

      //Get todays filtered remarks
      this.doUpdateNotification();
  }

  private selectCurrentLoggedIn(){
    console.log("selectCurrentLoggedIn");
    console.log(JSON.parse(localStorage.getItem('currentUser')).role);
    //If the student himself is logged in 
    if(JSON.parse(localStorage.getItem('currentUser')).role == 1) {
      this.setSelectedStudent("currentUser");
     }

    //  if the parent is logged in
     if(JSON.parse(localStorage.getItem('child')) != null) {
      this.setSelectedStudent("child");
    }
  }

  private setSelectedStudent(user: string){
      console.log(user);
      this.selectedStudent = new  Student();
      this.selectedStudent.id = JSON.parse(localStorage.getItem(user)).id;
      this.selectedStudent.firstName = JSON.parse(localStorage.getItem(user)).firstName;
      this.selectedStudent.lastName = JSON.parse(localStorage.getItem(user)).lastName;
      this.selectedStudent.active = JSON.parse(localStorage.getItem(user)).active;
      this.selectedStudent.email = JSON.parse(localStorage.getItem(user)).email;
      this.selectedStudent.username = JSON.parse(localStorage.getItem(user)).username;
      this.selectedStudent.password = JSON.parse(localStorage.getItem(user)).password;
      this.selectedStudent.language = JSON.parse(localStorage.getItem(user)).language;
      this.selectedStudent.lastLoginDate = JSON.parse(localStorage.getItem(user)).lastLoginDate;
      this.selectedStudent.role = JSON.parse(localStorage.getItem(user)).role;
      this.selectedStudent.class1 = JSON.parse(localStorage.getItem(user)).class1;
      this.selectedStudent.class1_id = JSON.parse(localStorage.getItem(user)).class1_id;
      //Add the role -- OLD CODE
      // let role: Role = new Role();
      // role.id = JSON.parse(localStorage.getItem(user)).roles[0].id;
      // role.name = JSON.parse(localStorage.getItem(user)).roles[0].name;
      // let roles: Role[];
      // roles = [];
      // roles.push(role);
      // this.selectedStudent.roles = roles;
      //Add the class -- OLD CODE
      // let cs: Class_schoolyear = new Class_schoolyear();
      // cs.class_schoolyear_id = JSON.parse(localStorage.getItem(user)).classSchoolyears[0].class_schoolyear_id;
      // cs.schoolClass = JSON.parse(localStorage.getItem(user)).classSchoolyears[0].schoolClass;
      // cs.schoolyear_id = JSON.parse(localStorage.getItem(user)).classSchoolyears[0].schoolyear_id;
      // let css: Class_schoolyear[];
      // css = [];
      // css.push(cs);
      // this.selectedStudent.classSchoolyears = css;
  }

  private initFilterForm(){
    this.filterForm = this.formBuilder.group ({
      filterDateFrom: ['', Validators.required],
      filterDateTo: ['', Validators.required],
      filterAuthorId: ['', Validators.required],
      // filterStudentId: ['', Validators.required],
      filterSeverity1: [''],
      filterSeverity2: [''],
      filterSeverity3: [''],
      filterSeverity4: ['']
    });
    this.filterForm.setValidators(this.severityValidator);

    //init the start values
    this.h24();

    this.filterAuthorId = "all";
    // this.filterStudentId = "all";
    this.filterForm.controls['filterAuthorId'].setValue(this.filterAuthorId);
    // this.filterForm.controls['filterStudentId'].setValue(this.filterStudentId);
    
    this.filterSeverity1 = true;
    this.filterForm.controls['filterSeverity1'].setValue(this.filterSeverity1);
    this.filterSeverity2 = true;
    this.filterForm.controls['filterSeverity2'].setValue(this.filterSeverity2);
    this.filterSeverity3 = true;
    this.filterForm.controls['filterSeverity3'].setValue(this.filterSeverity3);
    this.filterSeverity4 = true; 
    this.filterForm.controls['filterSeverity4'].setValue(this.filterSeverity4);
}

 //Our own custom validator for checking at least one severity
 private severityValidator(group: FormGroup): any {
  if (group) {
    if ((!group.get("filterSeverity1").value && !group.get("filterSeverity2").value
          && !group.get("filterSeverity3").value && !group.get("filterSeverity4").value)
          || (group.get("filterDateFrom").value > group.get("filterDateTo").value) ) {
      return { notMatching : true };
    }
  }
  return null;
}

setTodayCounts(){
  console.log("Entering setTodayCounts");
  this.todaysOnes = 0;
  this.todaysTwos = 0;
  this.todaysThrees = 0;
  this.todaysFours = 0;
  for(var i=0; i< this.filteredRemarks.length; i++){
    if(this.filteredRemarks[i][3] == 1){
      this.todaysOnes++;
      console.log(this.todaysOnes);
    }
    if(this.filteredRemarks[i][3] == 2){
      this.todaysTwos++;
    }
    if(this.filteredRemarks[i][3] == 3){
      this.todaysThrees++;
    }
    if(this.filteredRemarks[i][3] == 4){
      this.todaysFours++;
    }
  }
}

getFilteredStudents(): String{
  let toret: String;
  toret = "";
  if(this.selectedStudent){
    toret += this.selectedStudent.lastName + " " + this.selectedStudent.firstName + " (" + this.selectedStudent.class1 + ")";
    return toret;
  }
  if(this.selectedSchoolClass){
    toret += this.selectedSchoolClass.class1;
    return toret;
  }
  toret += "Alle leerlingen";

  return toret;
}

getFilteredAuthors(): String{
    return "Alle leerkrachten";
}

getFilteredSeverities(){
  let toret: String;
  toret = "";
  if(this.filterSeverity1 == true){
    toret += " 1 ";
  }
  if(this.filterSeverity2 == true){
    toret += " 2 ";
  }
  if(this.filterSeverity3 == true){
    toret += " 3 ";
  }
  if(this.filterSeverity4 == true){
    toret += " 4 ";
  }
  return toret;
}

getRemarkColor(severity): string {
  let toret: string;
  toret = "black";

  if(severity == 1){
    toret = "green";
  }
  if(severity == 2){
    toret =  "yellow"
  }
  if(severity == 3){
    toret =  "orange";
  }
  if(severity == 4){
    toret =  "red"
  }
  console.log(toret);

  return toret;
}

createHeading(text) {
  return new Paragraph(text).heading1().thematicBreak();
}

downloadWord(){
  var document = new Document();
  // document.addParagraph(new Paragraph("Rapport opmerkingen").title());
  document.addParagraph(this.createHeading("Rapport opmerkingen"));
  document.addParagraph(new Paragraph().addRun(new TextRun("Gegenereerd op: " + this.today.toLocaleString()).bold().break()));

  document.addParagraph(new Paragraph("Toegepaste filters: "));

  document.addParagraph(new Paragraph("leerling(en): " + this.getFilteredStudents()).bullet());
  document.addParagraph(new Paragraph("van: " + this.filterDateFrom).bullet());
  document.addParagraph(new Paragraph("tot: " + this.filterDateTo).bullet());
  document.addParagraph(new Paragraph("door: " + this.getFilteredAuthors()).bullet());
  document.addParagraph(new Paragraph("ernst: " + this.getFilteredSeverities()).bullet());

  document.addParagraph(new Paragraph("Voor de opgegeven filters werden " + this.filteredRemarks.length + " opmerkingen gevonden."));
  
  const table = document.createTable(this.filteredRemarks.length, 5);
  table.getRow(0).getCell(0).CellProperties.setWidth(8, WidthType.PERCENTAGE);
  table.getRow(0).getCell(1).CellProperties.setWidth(25, WidthType.PERCENTAGE);
  table.getRow(0).getCell(2).CellProperties.setWidth(30, WidthType.PERCENTAGE);
  table.getRow(0).getCell(3).CellProperties.setWidth(12, WidthType.PERCENTAGE);
  table.getRow(0).getCell(4).CellProperties.setWidth(25, WidthType.PERCENTAGE);

  for(var i=0; i< this.filteredRemarks.length; i++){
    table.getRow(i).getCell(0).addContent(new Paragraph(this.filteredRemarks[i][10]));
    table.getRow(i).getCell(1).addContent(new Paragraph(this.filteredRemarks[i][9] + " " + this.filteredRemarks[i][8]));
    // table.getRow(i).getCell(2).addContent(new Paragraph(this.filteredRemarks[i][3] + " - " + this.filteredRemarks[i][2]));
    table.getRow(i).getCell(2).addContent(new Paragraph(this.filteredRemarks[i][3] + " - " + this.filteredRemarks[i][2]));
    let remarkColor: string = this.getRemarkColor(this.filteredRemarks[i][3]);
    table.getRow(i).getCell(2).CellProperties.Borders.addBottomBorder(BorderStyle.DOUBLE, 3, remarkColor);
    table.getRow(i).getCell(3).addContent(new Paragraph(this.filteredRemarks[i][1]));
    table.getRow(i).getCell(4).addContent(new Paragraph(this.filteredRemarks[i][6] + " " + this.filteredRemarks[i][7]));

  }
  
  const packer = new Packer();

  packer.toBlob(document).then(blob => {
    console.log(blob);
    FileSaver.saveAs(blob, "scalliTest.docx");
    console.log("Document created successfully");
  });
}

doUpdateNotification(){
  this.applyTodayFilter();
}

applyTodayFilter(){
  let remarksFilter: RemarkFilterForm;
  remarksFilter = new RemarkFilterForm();
  remarksFilter.fromDate = this.filterForm.get('filterDateTo').value; //TODAY
  remarksFilter.toDate = this.filterForm.get('filterDateTo').value; //TODAY
  remarksFilter.authorId = 0;
  remarksFilter.studentId = JSON.parse(localStorage.getItem('currentUser')).id;
  remarksFilter.schoolClassId = 0;

  remarksFilter.severities = [];
  remarksFilter.severities.push(1);
  remarksFilter.severities.push(2);
  remarksFilter.severities.push(3);
  remarksFilter.severities.push(4);

//    for(let i=0; i< 2000; i++ ){
   //console.log(i);
   this.showNotification = true;
    this.model.getStudentsOwnFilteredRemarks(remarksFilter);

    this.filterChangedNotApplied = false;
//    }
}

  applyFilter(){
    let remarksFilter: RemarkFilterForm;
    remarksFilter = new RemarkFilterForm();
    remarksFilter.fromDate = this.filterForm.get('filterDateFrom').value;
    remarksFilter.toDate = this.filterForm.get('filterDateTo').value;

    remarksFilter.authorId = 0;
    remarksFilter.studentId = this.selectedStudent.id;

    remarksFilter.severities = [];
    if(this.filterForm.get('filterSeverity1').value){
      remarksFilter.severities.push(1);
    }
    else {
      remarksFilter.severities.push(0);
    }
    if(this.filterForm.get('filterSeverity2').value){
      remarksFilter.severities.push(2);
    }
    else {
      remarksFilter.severities.push(0);
    }
    if(this.filterForm.get('filterSeverity3').value){
      remarksFilter.severities.push(3);
    }
    else {
      remarksFilter.severities.push(0);
    }
    if(this.filterForm.get('filterSeverity4').value){
      remarksFilter.severities.push(4);
    }
    else {
      remarksFilter.severities.push(0);
    }

//    for(let i=0; i< 2000; i++ ){
     //console.log(i);
      this.model.getStudentsOwnFilteredRemarks(remarksFilter);
//    }
    

    this.filterChangedNotApplied = false;
  }

  onExtraInfo(extra){
    if(extra){
      this.extraInfoSelected = extra;
      this.displayExtraInfo = 'block';
    }
  }
  
  hideExtraInfo(){
    this.displayExtraInfo = 'none';
  }

  h24(){
    this.setDates(0);
    this.filterChangedNotApplied = true;
  }

  h48(){
    this.setDates(1);
    this.filterChangedNotApplied = true;
  }

  h72(){
    this.setDates(2);
    this.filterChangedNotApplied = true;
  }

  d7(){
    this.setDates(7);
    this.filterChangedNotApplied = true;
  }

  d30(){
    this.setDates(30);
    this.filterChangedNotApplied = true;
  }

  d90(){
    this.setDates(90);
    this.filterChangedNotApplied = true;
  }

  remarkFilterChanged() {
    this.filterChangedNotApplied = true;
    console.log(this.filterForm.get('filterSeverity1').value);
  }

  
  setSeverity1(){
      this.filterSeverity1 = this.filterForm.get('filterSeverity1').value;
  }

  setSeverity2(){
    this.filterSeverity2 = this.filterForm.get('filterSeverity2').value;
}

setSeverity3(){
  this.filterSeverity3 = this.filterForm.get('filterSeverity3').value;
}

setSeverity4(){
  this.filterSeverity4 = this.filterForm.get('filterSeverity4').value;
}

private setDates(startDateDays: number){
  var start = new Date(this.today.getTime());
  start.setDate(this.today.getDate() - startDateDays);
  this.filterDateFrom = formatDate(start, 'yyyy-MM-dd', 'en');
  this.filterDateTo = formatDate(this.today, 'yyyy-MM-dd', 'en');
  this.filterForm.controls['filterDateFrom'].setValue(this.filterDateFrom);
  this.filterForm.controls['filterDateTo'].setValue(this.filterDateTo);
}
}
