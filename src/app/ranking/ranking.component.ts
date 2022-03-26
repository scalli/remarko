import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from '@angular/router';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  private rankings: [number,string,string,string,number,number,number,number,number];
  public HTMLtext;
  public last_update;
  public start_date;
  public end_date;
  public positions: [number];
  public allRankingsSelected: boolean;//If not true, then rankings ordered by class is selected
  private currentUserRoleId: number;
  private currentUserId: number;
  public dateFrom: string;
  public dateTo: string;
  public lastUpdated: string;
  
  constructor(private model: Model,
    private formBuilder: FormBuilder,
    activeRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() { 
    this.HTMLtext = JSON.parse(localStorage.getItem('multiLangText'));
    this.currentUserRoleId = JSON.parse(localStorage.getItem('currentUser')).roles[0].id;
    this.currentUserId = JSON.parse(localStorage.getItem('currentUser')).id;
    // console.log(this.currentUserRoleId);
    this.positions = [0];
    this.allRankingsSelected = true;
    // //Dummy position 0
    // this.positions.push(0);
    this.getLastUpdatedDate();
    this.getStartDate();
    this.getEndDate();

    this.model.getAllRankings();
    this.model.allRankingsLoaded.subscribe(
      (data: [number,string,string,string,number,number,number,number,number]) => {
        this.rankings = data;
        console.log(data);
        if(this.allRankingsSelected){
          this.getAllPositions();
        }
        else{//rankings by class is selected
          this.getAllPositionsSortedByClass();
        }
      },
      error => { 

      }
    )

    localStorage.setItem('rankingFilterText','');
  }

  allRankings(){
    this.allRankingsSelected = true;
    this.model.getAllRankings();
  }

  allByClassRankings(){ 
    this.allRankingsSelected = false;
    this.model.getRankingsSortedByClass();
  }

  //Add the postions to the end of the array when 'all' is selected
  getAllPositions(){
    let currentPosition = 1;
    for(let i=0; i< this.rankings.length; i++){
      if(i == 0){
        this.rankings[i][9] = currentPosition;
      } 
      else{
        if(this.rankings[i][8] === this.rankings[i-1][8]){
          this.rankings[i][9] = currentPosition;
        }
        else{
          currentPosition = i + 1;
          this.rankings[i][9] = currentPosition;
        }
      } 
      //Obfuscate names if 
      //1. not teacher or admin logged in
      //2. not logged in user (=student can see  own result)
      //3. not position 1 (first is always shown)
      if((this.currentUserRoleId < 3 && (this.currentUserId != this.rankings[i][0] && this.rankings[i][9] != 1))) {
        this.rankings[i][1] = this.stringToStar(this.rankings[i][1]);
        this.rankings[i][2] = this.stringToStar(this.rankings[i][2]);
      }    
    }
  }

  //Add the positions to the end of the array when 'by class' is selected
  getAllPositionsSortedByClass(){
    let currentPosition = 1;
    let classCount = 0;
    let startNewClass= true;
    for(let i=0; i< this.rankings.length; i++){
      classCount++;
      //Reset position to 1 for start of new class
      if(i === 0 || this.rankings[i][3] != this.rankings[i-1][3]){
        currentPosition = 1;
        startNewClass = true;
        classCount = 0;
      }
      if(i == 0 || startNewClass){
        this.rankings[i][9] = currentPosition;
        startNewClass = false;
        currentPosition = 1;
        classCount = 0;
      } 
      else{
        if(this.rankings[i][8] === this.rankings[i-1][8]){
          this.rankings[i][9] = currentPosition;
        }
        else{
          currentPosition = classCount + 1;
          this.rankings[i][9] = currentPosition;
        }
      } 
      //Obfuscate names if 
      //1. not teacher or admin logged in
      //2. not logged in user (=student can see  own result)
      //3. not position 1 (first is always shown)
      if((this.currentUserRoleId < 3 && (this.currentUserId != this.rankings[i][0] && this.rankings[i][9] != 1))) {
        this.rankings[i][1] = this.stringToStar(this.rankings[i][1]);
        this.rankings[i][2] = this.stringToStar(this.rankings[i][2]);
      }
    }
  }
  
  stringToStar(toOb: string) :string{
    return "*".repeat(toOb.length);
  }

  getLastUpdatedDate(): void{
    // this.last_update = JSON.parse(localStorage.getItem('rankingSettings'))[0][8] * 1000;
    this.last_update = JSON.parse(localStorage.getItem('rankingSettings')).last_updated * 1000;
    this.lastUpdated = formatDate(this.last_update, 'yyyy-MM-dd', 'en');
  }

  getStartDate(): void{
    // this.start_date = JSON.parse(localStorage.getItem('rankingSettings'))[0][6] * 1000;
    this.start_date = JSON.parse(localStorage.getItem('rankingSettings')).ranking_start_date * 1000;
    this.dateFrom = formatDate(this.start_date, 'yyyy-MM-dd', 'en');
  }

  getEndDate(): void{
    // this.end_date = JSON.parse(localStorage.getItem('rankingSettings'))[0][7] * 1000;
    this.end_date = JSON.parse(localStorage.getItem('rankingSettings')).ranking_end_date * 1000;
    this.dateTo = formatDate(this.end_date, 'yyyy-MM-dd', 'en');
  }

  onFilterChange(value: string) {
    console.log(value);
    localStorage.setItem('rankingFilterText',value);
  }

  filterApplies(ranking: any[]){
    // console.log('filterText');
    // console.log(localStorage.getItem('filterText'));
    let filterText = localStorage.getItem('rankingFilterText');
    if(filterText.length > 0){  
      if(ranking[1].toLowerCase().includes(filterText.toLowerCase()) 
      || ranking[2].toLowerCase().includes(filterText.toLowerCase())
      || ranking[3].toLowerCase().includes(filterText.toLowerCase())){
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
