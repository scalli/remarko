import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Model } from "../model/repository.model";
import { FileUtil } from '../csvutils/file.util';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { ParentStudentInfo } from '../model/parentStudentInfo.model';
import { EditPasswordForm } from '../model/EditPasswordForm.model';
import { SignupUser } from '../model/signupUser.model';
import { Angular2CsvModule } from 'angular2-csv';

@Component({
  selector: 'app-parents',
  templateUrl: './parents.component.html',
  styleUrls: ['./parents.component.css']
})
export class ParentsComponent implements OnInit {

  HTMLtext;
  parents: ParentStudentInfo[];
  createNewParentAccountsForTheseStudentIds: ParentStudentInfo[];
  // createdNewParentAccountsForTheseStudentIds: any[];
  generateNewCredentialsForTheseParentIds: ParentStudentInfo[];
  // generatedNewCredentialsForTheseParentIds: any[];
  lastCreatedOrChanged: any[];
  accountsChanged: number;

  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: ['naam', 'klas', 'gebruikersnaam', 'wachtwoord'],
    showTitle: true,
    title: 'account logins',
    useBom: false,
    removeNewLines: true,
    keys: ['student','schoolClass','username', 'password' ]
  };
  // data = [
  //   {
  //     name: "Test, 1",
  //     age: 13,
  //     average: 8.2,
  //     approved: true,
  //     description: "using 'Content here, content here' "
  //   },
  //   {
  //     name: 'Test 2',
  //     age: 11,
  //     average: 8.2,
  //     approved: true,
  //     description: "using 'Content here, content here' "
  //   },
  //   {
  //     name: 'Test 3',
  //     age: 10,
  //     average: 8.2,
  //     approved: true,
  //     description: "using 'Content here, content here' "
  //   }
  // ]
   //data =[];


  constructor(
          private model: Model,
          private formBuilder: FormBuilder,
          private _fileUtil: FileUtil,
          activeRoute: ActivatedRoute,
          private router: Router
          ) { }

  ngOnInit() {
    // console.log(this.data);
    this.lastCreatedOrChanged = [];
    this.accountsChanged = 0;
    this.HTMLtext = JSON.parse(localStorage.getItem('multiLangText'));
    this.createNewParentAccountsForTheseStudentIds = [];
    this.generateNewCredentialsForTheseParentIds = [];

    this.model.accountChanged.subscribe(
      data => {
        this.accountsChanged++;
        console.log("accountsChanged");
        console.log(this.accountsChanged);
        if(this.accountsChanged == this.lastCreatedOrChanged.length){
          this.model.getParents();
          this.accountsChanged = 0;
        }
      }
    )

    if( localStorage.getItem('parents')){
      this.parents = JSON.parse(localStorage.getItem('parents'));
    }
    else{
      this.parents = this.model.getParents();
    }
  
    this.model.parentsLoaded.subscribe(
      (message: String) => {
        this.parents = JSON.parse(localStorage.getItem('parents'));
      });
  }

  onSelectNew(event, parent){
    if (event.target.checked ) {
      console.log(parent);
      this.createNewParentAccountsForTheseStudentIds.push(parent);
      console.log(this.createNewParentAccountsForTheseStudentIds);
    }
   //Was checked but not anymore
    else{
      console.log('unchechecked');
      console.log(parent);
      this.removeFromStudentIdsArray(parent);
   }
  }

  onSelectParent(event, parent){
    if ( event.target.checked ) {
      console.log(parent);
      this.generateNewCredentialsForTheseParentIds.push(parent);
      console.log(this.generateNewCredentialsForTheseParentIds);
    }
    //Was checked but not anymore
    else{
      console.log('unchechecked');
      console.log(parent);
      this.removeFromParentIdsArray(parent);
    }
  } 
  
  generate(){
    console.log("generate");

    this.updateParentsPasswords();

    this.createParentAccounts();

  }

  
  createParentAccounts(){
    // this.createdNewParentAccountsForTheseStudentIds = [];
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    const lengthOfCode = 6;

    for(var i=0; i<this.createNewParentAccountsForTheseStudentIds.length; i++){
      let randompw1 = this.makeRandom(lengthOfCode, possible);

      // this.createdNewParentAccountsForTheseStudentIds[i] = [];
      var parent1: SignupUser = {};
      parent1 = this.createParent(randompw1, this.createNewParentAccountsForTheseStudentIds[i].studentId + "-father@msninove.be");
      this.model.createParentAccountsForStudent(parent1, this.createNewParentAccountsForTheseStudentIds[i].studentId);
      this.lastCreatedOrChanged.push(
        {
          student : this.createNewParentAccountsForTheseStudentIds[i].studentFirstName + "" + this.createNewParentAccountsForTheseStudentIds[i].studentLastName,
          schoolClass : this.createNewParentAccountsForTheseStudentIds[i].schoolClass,
          username : this.createNewParentAccountsForTheseStudentIds[i].studentId + "-father@msninove.be",
          password : randompw1
        }
      )

      let randompw2 = this.makeRandom(lengthOfCode, possible);
      var parent2: SignupUser = {};
      parent2 = this.createParent(randompw2, this.createNewParentAccountsForTheseStudentIds[i].studentId + "-mother@msninove.be");
      this.model.createParentAccountsForStudent(parent2, this.createNewParentAccountsForTheseStudentIds[i].studentId)
      // this.createdNewParentAccountsForTheseStudentIds.push(
        this.lastCreatedOrChanged.push(
        {
          student : this.createNewParentAccountsForTheseStudentIds[i].studentFirstName + "" + this.createNewParentAccountsForTheseStudentIds[i].studentLastName,
          schoolClass : this.createNewParentAccountsForTheseStudentIds[i].schoolClass,
          username : this.createNewParentAccountsForTheseStudentIds[i].studentId + "-mother@msninove.be",
          password : randompw2
        }
      )
    }
    // console.log(this.createdNewParentAccountsForTheseStudentIds);
    // this.data = this.createdNewParentAccountsForTheseStudentIds;
  }

  createParent(randompw: string, username: string){
    var parent1: SignupUser = {};
    parent1.firstName = "";
    parent1.lastName = "";
    parent1.username = username; //this.createNewParentAccountsForTheseStudentIds[i] + "-father@msninove.be";
    parent1.email =  username; //this.createNewParentAccountsForTheseStudentIds[i] + "-father@msninove.be";
    parent1.password = randompw;
    parent1.active = true;
    parent1.language = "nl";
    parent1.lastLoginDate = "";//formatDate(new Date(), 'yyyy/MM/dd', 'en');
    parent1.role = 2;
    // parent1.roles = [
    //   {
    //       "id": 2,
    //       "name": "ROLE_PARENT1"
    //   }
    // ];
    parent1.class1_id = 0; //dummy value -> does this work?
    // parent1.classSchoolyears = [];

    return parent1;
  }
  
  updateParentsPasswords(){
    // this.generatedNewCredentialsForTheseParentIds = [];
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    const lengthOfCode = 6;

    for(var i=0; i<this.generateNewCredentialsForTheseParentIds.length; i++){
      let randompw = this.makeRandom(lengthOfCode, possible);

      let editForm: EditPasswordForm;
      editForm = new EditPasswordForm();
      editForm.id = this.generateNewCredentialsForTheseParentIds[i].parentId;
      editForm.password = randompw;
      console.log(randompw);

      this.model.updateParentPassword(editForm);
      this.lastCreatedOrChanged.push(
        {
          student : this.generateNewCredentialsForTheseParentIds[i].studentFirstName + "" + this.generateNewCredentialsForTheseParentIds[i].studentLastName,
          schoolClass : this.generateNewCredentialsForTheseParentIds[i].schoolClass,
          username : this.generateNewCredentialsForTheseParentIds[i].parentEmail,
          password : randompw
        }
      );
    }
    // console.log(this.generatedNewCredentialsForTheseParentIds);
    // this.data.push(this.generatedNewCredentialsForTheseParentIds);
  }


  makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
      return text;
  }

  selectAll(){
    console.log('selectAll');
  }
  
  private removeFromStudentIdsArray(studid:ParentStudentInfo){
      const index: number = this.createNewParentAccountsForTheseStudentIds.indexOf(studid);
      if (index !== -1) {
          this.createNewParentAccountsForTheseStudentIds.splice(index, 1);
      }        
  }

  private removeFromParentIdsArray(parentId: ParentStudentInfo){
    const index: number = this.generateNewCredentialsForTheseParentIds.indexOf(parentId);
    if (index !== -1) {
        this.generateNewCredentialsForTheseParentIds.splice(index, 1);
    } 
  }

}
