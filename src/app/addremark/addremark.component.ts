import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../model/student.model';
import { Remarkoptions } from '../model/remarkoptions.model';
import { RemarksSaveForm } from '../model/remarksSaveForm.model';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-addremark',
  templateUrl: './addremark.component.html',
  styleUrls: ['./addremark.component.css']
})
export class AddremarkComponent implements OnInit {

  constructor(
    private model: Model,
    private formBuilder: FormBuilder,
    activeRoute: ActivatedRoute,
    private router: Router) { }

    allStudents: Student[];
    selectedStudents: Student[];
    selectableStudents: Student[];

    remarkoptions: Remarkoptions[];
    selectedDate: Date;
    selectedOption: string;
    extraInfo: string;
    severity: number;
    showUpper: boolean;
    showLower: boolean;
    HTMLtext;

  ngOnInit() {

    this.selectedStudents= [];
    localStorage.setItem('filterText',"");

    this.showUpper = true;
    this.showLower = false;

    this.HTMLtext = JSON.parse(localStorage.getItem('multiLangText'));
    this.remarkoptions = JSON.parse(localStorage.getItem('remarkoptions'));

    this.selectedDate = new Date(); 
    this.severity = 0;   
    this.selectedOption = "";

    if( localStorage.getItem('students').length > 10){
      this.selectableStudents = JSON.parse(localStorage.getItem('students'));
    }
    else{
      this.selectableStudents = this.model.getStudents();
    }

    this.model.remarksSaved.subscribe(
      data => {
        this.selectedStudents= [];
        this.severity = 0;   
        this.selectedOption = "";
        if( localStorage.getItem('students').length > 0){
          this.selectableStudents = JSON.parse(localStorage.getItem('students'));
        }
        else{
          this.selectableStudents = this.model.getStudents();
        }

      }
    );

    // if( localStorage.getItem('students').length > 10){
    //   this.allStudents = JSON.parse(localStorage.getItem('students'));
    // }
    // else{
    //   this.allStudents = this.model.getStudents();
    // }
    
    this.model.studentsChangeDetected.subscribe(
      (message: String) => {
        // console.log("studentschangedetected in addremark. Students updated.")
        // console.log(localStorage.getItem('students').toString());
        // this.allStudents = JSON.parse(localStorage.getItem('students'));
        this.selectableStudents = JSON.parse(localStorage.getItem('students'));
      });
  }

  toLower(){
    this.showLower = true;
    this.showUpper = false;
  }

  toUpper(){
    this.showUpper = true;
    this.showLower= false;
  }

  selectedDateChanged(newDate){
   this.selectedDate = newDate;
    console.log(this.selectedDate);
  }

  selectedOptionChanged(newOption){
    this.selectedOption = newOption;
    console.log(this.selectedOption);
  }

  extraInfoChanged(newExtraInfo){
    this.extraInfo = newExtraInfo;
    console.log(newExtraInfo);
  }
  severityChanged(newSeverity){
    this.severity = newSeverity;
    console.log(this.severity);
  }

  saveRemarks(){
    let remark: RemarksSaveForm;
    remark = new RemarksSaveForm();
    remark.studentId = [];
    remark.date = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en');
    remark.extraInfo  = this.extraInfo;
    remark.remark = this.selectedOption;
    remark.severity = this.severity;
    for(var i=0; i< this.selectedStudents.length; i++){
      remark.studentId.push(this.selectedStudents[i].id);
    }
    remark.teacherId = JSON.parse(localStorage.getItem('currentUser')).id;
    console.log("Remark made. Now saving.");
//    for(var i=0; i< 100; i++){
      this.model.saveRemarks(remark);
//    }
  }
  
  
  notAllFilledIn(){
    if(this.selectedStudents.length == 0 || this.selectedOption == "" || this.severity == 0)
      return true;
    else
      return false;
  }

  selectStudent(index: number){
    this.selectedStudents.push(this.selectableStudents[index]);
    this.selectableStudents.splice(index, 1);
    // console.log("selectedStudents:");
    // console.log(this.selectedStudents);
    // console.log("selectableStudents");
    // console.log(this.selectableStudents);
  }

  unSelectStudent(index: number){
    this.selectableStudents.push(this.selectedStudents[index]);
    this.selectableStudents.sort(this.model.sortByclass);
    this.selectedStudents.splice(index, 1);
    // console.log("selectedStudents:");
    // console.log(this.selectedStudents);
    // console.log("selectableStudents");
    // console.log(this.selectableStudents);
  }

  onFilterChange(value: string) {
    console.log(value);
    localStorage.setItem('filterText',value);
  }

  filterApplies(student: Student){
    // console.log('filterText');
    // console.log(localStorage.getItem('filterText'));
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

}
