import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../model/student.model';
import { Class_schoolyear } from '../model/class_schoolyear.model';
import {formatDate} from '@angular/common';
import { RemarkFilterForm } from '../model/remarkFilterForm.model';
import { Document, Paragraph, Packer, TextRun, BorderStyle } from "docx";
import { WidthType } from "docx";
import * as FileSaver from 'file-saver';
// import {FileSaver} from 'file-saver';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  selectableStudents: Student[];
  selectedStudent: Student;
  selectedSchoolClass: Class_schoolyear;

  lastUpdateNotification: Date;
  showNotification: boolean;
  UNIXTimeHour: number;

  todaysOnes: number;
  todaysTwos: number;
  todaysThrees: number;
  todaysFours: number;

  classSchoolyears;

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

  showUpper: boolean;
  showLower: boolean;

  filterChangedNotApplied: boolean;

  today: Date;
  extraInfoSelected: string;
  displayExtraInfo: string;

  HTMLtext;

  filteredRemarks;
  remarkToDeleteId: number;

  filterForm: FormGroup;

  chartViewSelected: boolean;
  listViewSelected: boolean;

  // ---------------------------------- START OF GRAPH PARAMETERS ---------------------------
  single: any[];

  view: any[] = [320, 700];
 
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Country';
  showYAxisLabel = false;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#4CAF50', '#ffeb3b', '#ff9800', '#f44336']
  };

  data: any[];

  // ---------------------------------- END OF GRAPH PARAMETERS ---------------------------

  constructor( private model: Model,
              private formBuilder: FormBuilder,
              activeRoute: ActivatedRoute,
              private router: Router
              ) { }

  ngOnInit() {
    this.chartViewSelected = true;
    this.listViewSelected= false;
   
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

    this.initFilterForm();

    this.showUpper = true;
    this.showLower = false;
    
    this.model.filteredRemarksArrived.subscribe(
      data => {
        this.filteredRemarks = data;
        console.log(this.filteredRemarks);
        if(this.showNotification){
          this.setTodayCounts();
          this.showNotification = false;
        }
        this.initGraph();
        console.log(this.getDatesBetween(new Date(this.filterDateFrom), new Date(this.filterDateTo) ));
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

    this.model.remarkDeleted.subscribe(
      data => {
        console.log("remark deleted, now applying filter");
        this.applyFilter();
      },
      error => {
        console.log("error deleting remark"); 
      }
    )

    if( localStorage.getItem('students')){
      this.selectableStudents = JSON.parse(localStorage.getItem('students'));
    }
    else{
      this.selectableStudents = this.model.getStudents();
    }

  
    this.model.studentsChangeDetected.subscribe(
      (message: String) => {
        // console.log("studentschangedetected in addremark. Students updated.")
        // console.log(localStorage.getItem('students').toString());
        // this.allStudents = JSON.parse(localStorage.getItem('students'));
        this.selectableStudents = JSON.parse(localStorage.getItem('students'));
      }); 

      //Get todays filtered remarks
      this.doUpdateNotification();
  }//end of ngOnInit

  setSchoolClasses(){
    this.classSchoolyears = JSON.parse(localStorage.getItem('classSchoolyears'));
    console.log(this.classSchoolyears);
  }
  
  selectedSchoolClassChanged(newSchoolClass){
    this.selectedSchoolClass = newSchoolClass;
    this.selectedStudent = null;
    console.log(this.selectedSchoolClass)
//    console.log(this.selectedSchoolClass);
  }
  
  onDeleteRemark(remarkId: number){
    this.remarkToDeleteId = remarkId;
    console.log("delete remark with id " + this.remarkToDeleteId);
  }

  onDeleteFinal() {
    console.log("Now deleting remark with id " + this.remarkToDeleteId);
    this.model.deleteRemark(this.remarkToDeleteId);
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

  setAuthorId(){
    this.filterAuthorId = this.filterForm.get('filterAuthorId').value;
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
  
  onSelectStudent(student: Student){
    this.selectedStudent = student;
    this.selectedSchoolClass = null;
    // console.log(this.selectedStudent);
  }
  
  onFilterChange(value: string) {
    // console.log(value);
    localStorage.setItem('filterText',value);
  }

  // doUpdateNotification1(){
  //   this.showNotification = false;
  //   let now :Date = new Date();

  //   if(localStorage.getItem('lastUpdateNotification')){
  //     this.lastUpdateNotification = new Date(JSON.parse(localStorage.getItem('lastUpdateNotification')));
  //     //If more than 6 hours time difference
  //     if((now.getTime() - this.lastUpdateNotification.getTime()) > 2* this.UNIXTimeHour){
  //       this.applyTodayFilter();
  //       console.log("applying today filter...");
  //       this.showNotification =true;
  //     }
  //   }
  //   else{
  //     localStorage.setItem('lastUpdateNotification',JSON.stringify(now));
  //     this.showNotification =true;
  //   }
  //   console.log(this.showNotification);
  // }

  doUpdateNotification(){
    this.applyTodayFilter();
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
    if(this.filterAuthorId != "all"){
      let current = JSON.parse(localStorage.getItem("currentUser"));
      return current.firstName + " " + current.lastName;
    }
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


  filterApplies(student: Student){
    let filterText = localStorage.getItem('filterText');
    if(filterText.length > 0){  
      if(student.class1.toLowerCase().includes(filterText.toLowerCase()) 
            || student.firstName.toLowerCase().includes(filterText.toLowerCase())
            || student.lastName.toLowerCase().includes(filterText.toLowerCase())){
        return true;
      } 
      else {
        return false;
      }
    }
      else {
        return true;
      }
  }//end of filterApplies

  allStudents(){
    this.selectedStudent = null;
    this.selectedSchoolClass = null;
    this.filterChangedNotApplied = true;
  }

  applyFilter(){
    let remarksFilter: RemarkFilterForm;
    remarksFilter = new RemarkFilterForm();
    remarksFilter.fromDate = this.filterForm.get('filterDateFrom').value;
    remarksFilter.toDate = this.filterForm.get('filterDateTo').value;
    if(this.filterForm.get('filterAuthorId').value == "all"){
      remarksFilter.authorId = 0;
    }
    else {
      remarksFilter.authorId = JSON.parse(localStorage.getItem('currentUser')).id;
    }

    if(this.selectedStudent) {
      remarksFilter.studentId = this.selectedStudent.id;
    }
    else {
      remarksFilter.studentId = 0;
    }

    if(this.selectedSchoolClass) {
      remarksFilter.class1Id = this.selectedSchoolClass.schoolyear_id;
    }
    else {
      remarksFilter.class1Id = 0;
    }

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
      this.model.getFilteredRemarks(remarksFilter);
//    }
    

    this.filterChangedNotApplied = false;
  }

  applyTodayFilter(){
    let remarksFilter: RemarkFilterForm;
    remarksFilter = new RemarkFilterForm();
    remarksFilter.fromDate = this.filterForm.get('filterDateTo').value; //TODAY
    remarksFilter.toDate = this.filterForm.get('filterDateTo').value; //TODAY
    remarksFilter.authorId = 0;
    remarksFilter.studentId = 0;
    remarksFilter.class1Id = 0;

    remarksFilter.severities = [];
    remarksFilter.severities.push(1);
    remarksFilter.severities.push(2);
    remarksFilter.severities.push(3);
    remarksFilter.severities.push(4);

//    for(let i=0; i< 2000; i++ ){
     //console.log(i);
     this.showNotification = true;
      this.model.getFilteredRemarks(remarksFilter);
//    }
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

toLower(){
  this.showLower = true;
  this.showUpper = false;
  this.applyFilter();
}

toUpper(){
  this.showUpper = true;
  this.showLower= false;
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


private setDates(startDateDays: number){
  var start = new Date(this.today.getTime());
  start.setDate(this.today.getDate() - startDateDays);
  this.filterDateFrom = formatDate(start, 'yyyy-MM-dd', 'en');
  this.filterDateTo = formatDate(this.today, 'yyyy-MM-dd', 'en');
  this.filterForm.controls['filterDateFrom'].setValue(this.filterDateFrom);
  this.filterForm.controls['filterDateTo'].setValue(this.filterDateTo);
}

// Returns an array of dates between the two dates
getDatesBetween (startDate, endDate) {
  var dates = [],
      currentDate = startDate,
      addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  console.log(dates);
  return dates;
};

initGraph(){
  let dates = this.getDatesBetween(new Date(this.filterDateFrom), new Date(this.filterDateTo));
  // console.log(dates);
  this.data = [];
  for(let i=0; i<dates.length; i++){
    let pair: {};
    pair = {};
    pair["name"] = formatDate(dates[i], 'yyyy-MM-dd', 'en');;
    // this.multi.push(pair);
    //  console.log(this.multi);
     pair["series"] = [];
     let seriespair1: {} = {};
     seriespair1["name"] = 1;
     seriespair1["value"] = 0;
     pair["series"].push(seriespair1);
     let seriespair2: {} = {};
     seriespair2["name"] = 2;
     seriespair2["value"] = 0;
     pair["series"].push(seriespair2);
     let seriespair3: {} = {};
     seriespair3["name"] = 3;
     seriespair3["value"] = 0;
     pair["series"].push(seriespair3);
     let seriespair4: {} = {};
     seriespair4["name"] = 4;
     seriespair4["value"] = 0;
     pair["series"].push(seriespair4);
     this.data.push(pair);
  }
  console.log("initgraph");
  console.log(this.data);
  console.log(this.filteredRemarks);

  for(let i=0; i<this.filteredRemarks.length; i++){
    for(let j=0; j<this.data.length; j++){
      // console.log(this.data[j]["name"]);
      // console.log(this.filteredRemarks[i]["date"].substring(0,10));
      if(this.data[j]["name"] == this.filteredRemarks[i]["date"].substring(0,10)){
        let severitynumber = Number(this.filteredRemarks[i]["severity_id"]);
        this.data[j]["series"][severitynumber - 1]["value"]++;
      }
    }
  }
  console.log(this.data);

this.view = [300, this.data.length * 20];

}//end of initGraph function

selectListView(){
  this.chartViewSelected = false;
  this.listViewSelected= true;
}

selectGraphView(){
  this.chartViewSelected = true;
  this.listViewSelected= false;
}

}
