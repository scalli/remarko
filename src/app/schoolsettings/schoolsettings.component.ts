import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormGroup, FormBuilder, Validators} from "@angular/forms"
import { Model } from "../model/repository.model";
import { Schoolyear } from '../model/schoolyear.model';
import { Remarkoptions } from '../model/remarkoptions.model';
import { Class_schoolyear } from '../model/class_schoolyear.model';
import { RankingSettings } from '../model/rankingSettings.model';
import { formatDate } from "@angular/common";

@Component({
  selector: 'app-schoolsettings',
  templateUrl: './schoolsettings.component.html',
  styleUrls: ['./schoolsettings.component.css']
})
export class SchoolSettingsComponent implements OnInit {

  schoolyears: Schoolyear[];
  currentSchoolyearId: number;
  language: string;
  languageForm: FormGroup;
  schoolyearfilterForm: FormGroup;
  remarkoptions: Remarkoptions[];
  addRemarkForm: FormGroup;
  editRemarkForm: FormGroup;
  toEdit: Remarkoptions;
  toDelete: Remarkoptions; 
  rankingSettings: RankingSettings;
  
  classSchoolyears: Class_schoolyear[];
  csToEdit: Class_schoolyear;
  csToDelete: Class_schoolyear;
  addCSForm: FormGroup;
  editCSForm: FormGroup;
  rankingSettingsForm: FormGroup;

  ranking_start_date: string;
  ranking_end_date: string;

  currentSchoolyearText;

  HTMLtext;

  constructor(
    private model: Model,
    private formBuilder: FormBuilder,
    activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.HTMLtext = JSON.parse(localStorage.getItem('multiLangText'));
    this.rankingSettings = new RankingSettings();
    this.initRankingSettings();

    this.model.remarkoptionChangeDetected.subscribe(
      data => {
        this.remarkoptions = JSON.parse(localStorage.getItem('remarkoptions'));
      }
    );

    
    this.model.rankingSettingsLoaded.subscribe(
      data => {
        this.initRankingSettings();

        console.log("ranking settings loaded");
      },
      error => {
        console.log("error loading rankingsettings...");
      }
    );

    this.model.classSchoolyearsLoaded.subscribe(
      data => {
        this.classSchoolyears = JSON.parse(localStorage.getItem('classSchoolyears'));
        if(localStorage.getItem('currentSchoolyearId')){
          this.currentSchoolyearId = JSON.parse(localStorage.getItem('currentSchoolyearId'));
          this.setCurrentSchoolyearText();
        }
      }
    )

    this.model.schoolyearFilterUpdated.subscribe(
      data => {
        this.model.getClassSchoolyearsBySchoolyear();
      }
    );
    
    this.schoolyears = JSON.parse(localStorage.getItem('schoolyears'));
    console.log("schoolyears in schoolsettings: " + this.schoolyears);

    if(localStorage.getItem('currentSchoolyearId')){
      this.currentSchoolyearId = JSON.parse(localStorage.getItem('currentSchoolyearId'));
      this.setCurrentSchoolyearText();
    }

    if(localStorage.getItem('language')){
      this.language = localStorage.getItem('language');
    }

    this.languageForm = this.formBuilder.group ({
      language: ['', Validators.required]
    });

    this.schoolyearfilterForm = this.formBuilder.group ({
      schoolyearfilter: ['', Validators.required]
    });

    if(localStorage.getItem('remarkoptions')){
      this.remarkoptions = JSON.parse(localStorage.getItem('remarkoptions'));
    }

    if(localStorage.getItem('classSchoolyears')){
      this.classSchoolyears = JSON.parse(localStorage.getItem('classSchoolyears'));
    }

    console.log('updating schoolyearfilter...');
    console.log("currentschoolyearid: " + this.currentSchoolyearId);

    this.initForms();
  }


  initRankingSettings(){
    // this.rankingSettings.ranking_settings_id = JSON.parse(localStorage.getItem('rankingSettings'))[0][0];
    //   this.rankingSettings.ranking_start_total = JSON.parse(localStorage.getItem('rankingSettings'))[0][1];
    //   this.rankingSettings.one_penalty = JSON.parse(localStorage.getItem('rankingSettings'))[0][2];
    //   this.rankingSettings.two_penalty = JSON.parse(localStorage.getItem('rankingSettings'))[0][3];
    //   this.rankingSettings.three_penalty = JSON.parse(localStorage.getItem('rankingSettings'))[0][4];
    //   this.rankingSettings.four_penalty = JSON.parse(localStorage.getItem('rankingSettings'))[0][5];
    //   // this.rankingSettings.ranking_start_date = formatDate(JSON.parse(localStorage.getItem('rankingSettings'))[0][6],"dd/MM/yyyy",'en-US');
    //   this.ranking_start_date = formatDate(JSON.parse(localStorage.getItem('rankingSettings'))[0][6]*1000,"yyyy-MM-dd",'en');
    //   // this.rankingSettings.ranking_end_date = JSON.parse(localStorage.getItem('rankingSettings'))[0][7];
    //   this.ranking_end_date = formatDate(JSON.parse(localStorage.getItem('rankingSettings'))[0][7]*1000,"yyyy-MM-dd",'en');
    //   this.rankingSettings.last_updated = JSON.parse(localStorage.getItem('rankingSettings'))[0][8];

    this.rankingSettings = JSON.parse(localStorage.getItem('rankingSettings'));
    this.ranking_start_date = formatDate(this.rankingSettings.ranking_start_date*1000,"yyyy-MM-dd",'en');
    this.ranking_end_date = formatDate(this.rankingSettings.ranking_end_date*1000,"yyyy-MM-dd",'en');

      console.log(this.ranking_start_date);
      console.log( this.rankingSettings.ranking_settings_id);
      console.log(this.rankingSettings.one_penalty);
  }

  initRankingSettingsForm(){
    this.rankingSettingsForm.controls['ranking_start_total'].setValue(this.rankingSettings.ranking_start_total);
    this.rankingSettingsForm.controls['one_penalty'].setValue(this.rankingSettings.one_penalty);
    this.rankingSettingsForm.controls['two_penalty'].setValue(this.rankingSettings.two_penalty);
    this.rankingSettingsForm.controls['three_penalty'].setValue(this.rankingSettings.three_penalty);
    this.rankingSettingsForm.controls['four_penalty'].setValue(this.rankingSettings.four_penalty);
    // this.rankingSettingsForm.controls['ranking_start_date'].setValue(this.rankingSettings.ranking_start_date);
    this.rankingSettingsForm.controls['ranking_start_date'].setValue(this.ranking_start_date);
    // this.rankingSettingsForm.controls['ranking_end_date'].setValue(this.rankingSettings.ranking_end_date);
    this.rankingSettingsForm.controls['ranking_end_date'].setValue(this.ranking_end_date);
  }

  updateLanguage(){
    console.log('updating language...');
    this.model.updateSchoolLanguage(this.languageForm.get('language').value,
        JSON.parse(localStorage.getItem('currentSchool')).id);
  }

  updateSchoolyearfilter(){
    // console.log('updating schoolyearfilter...');
    // console.log("currentschoolyearid: " + this.currentSchoolyearId);
    this.model.updateSchoolyearfilter(this.schoolyearfilterForm.get('schoolyearfilter').value,
      JSON.parse(localStorage.getItem('currentSchool')).id);
  }

  setCurrentSchoolyearText(){
    this.currentSchoolyearText = this.schoolyears.find(x => x.id === this.currentSchoolyearId).schoolyear;
  }

  // ------------------------------- START OF CRUD OF REMARKOPTIONS ----------------------------------------------

  onEdit(remarkid: number){
    // this.remarkoptions = JSON.parse(localStorage.getItem('remarkoptions'));
    this.toEdit = this.remarkoptions.find(x => x.id === remarkid);
    console.log(this.toEdit);

    this.editRemarkForm.setValue({
      remark: this.toEdit.option
    });
  }
  
  saveEditedRemark(){
    this.toEdit.option = this.editRemarkForm.controls['remark'].value;
    this.model.editRemarkoption(this.toEdit);
    this.editRemarkForm.controls['remark'].setValue("");
  }

  addRemark(){
    let remarkoption: Remarkoptions = new Remarkoptions();
    remarkoption.option = this.addRemarkForm.controls['remark'].value;
    this.model.addRemarkoption(remarkoption);
    this.addRemarkForm.controls['remark'].setValue("");
  }

  onDelete(remarkid: number){
    this.toDelete = this.remarkoptions.find(x => x.id === remarkid);
  }

  onDeleteFinal(){
    this.model.deleteRemarkoption(this.toDelete);
  }

   // ------------------------------- END OF CRUD OF REMARKOPTIONS ----------------------------------------------

  // ------------------------------- START OF CRUD OF CLASS_SCHOOLYEARS ----------------------------------------------
  
  addCS(){
    let cs: Class_schoolyear = new Class_schoolyear();
    cs.class1 = this.addCSForm.controls['cs'].value;
    cs.schoolyear_id = JSON.parse(localStorage.getItem('currentSchoolyearId'));
    this.model.addClassSchoolyear(cs);
    this.addCSForm.controls['cs'].setValue("");
  }

  onCSEdit(CSid: number){
    this.csToEdit = this.classSchoolyears.find(x => x.id === CSid);
    console.log(this.csToEdit);

    this.editCSForm.setValue({
      cs: this.csToEdit.class1
    });
  }
  
  saveEditedCS(){
    this.csToEdit.class1 = this.editCSForm.controls['cs'].value;
    this.model.editClassSchoolyear(this.csToEdit);
    this.editCSForm.controls['cs'].setValue("");
  }

  onCSDelete(CSid: number){
    this.csToDelete = this.classSchoolyears.find(x => x.id === CSid);
  }

  onDeleteCSFinal(){
    this.model.deleteClassSchoolyear(this.csToDelete.id);
  }

  // ------------------------------- END OF CRUD OF CLASS_SCHOOLYEARS ----------------------------------------------

   // ------------------------------- START OF UPDATE RANKINGSETTINGS ----------------------------------------------
  
   updateRankingSettings(){
    console.log("updateRankingSettings");
    let r:  RankingSettings = new RankingSettings();
    r.ranking_settings_id = 1;
    r.ranking_start_total = this.rankingSettingsForm.controls['ranking_start_total'].value;
    r.one_penalty = this.rankingSettingsForm.controls['one_penalty'].value;
    r.two_penalty = this.rankingSettingsForm.controls['two_penalty'].value;
    r.three_penalty = this.rankingSettingsForm.controls['three_penalty'].value;
    r.four_penalty = this.rankingSettingsForm.controls['four_penalty'].value;
    r.ranking_start_date = new Date(this.rankingSettingsForm.controls['ranking_start_date'].value).getTime() / 1000;
    r.ranking_end_date = new Date(this.rankingSettingsForm.controls['ranking_end_date'].value).getTime() /1000;
    r.last_updated = new Date().getTime()/1000;

    console.log(r);
    this.model.updateRankingSettings(r);
    
  }

    // ------------------------------- END OF UPDATE RANKINGSETTINGS ----------------------------------------------

  private initForms(){
    this.addRemarkForm = this.formBuilder.group ({
      remark: ['', Validators.required]
    });

    this.editRemarkForm = this.formBuilder.group ({
      remark: ['', Validators.required]
    });

    this.addCSForm = this.formBuilder.group ({
      cs: ['', Validators.required]
    });

    this.editCSForm = this.formBuilder.group ({
      cs: ['', Validators.required]
    });

    this.rankingSettingsForm = this.formBuilder.group ({
      ranking_start_total: ['', Validators.required],
      one_penalty: ['', Validators.required],
      two_penalty: ['', Validators.required],
      three_penalty: ['', Validators.required],
      four_penalty: ['', Validators.required],
      ranking_start_date: ['', Validators.required],
      ranking_end_date: ['', Validators.required]
    });

    this.initRankingSettingsForm();
//    this.rankingSettingsForm.controls['ranking_start_total'].setValue(this.rankingSettings.ranking_start_total);
  }


}
