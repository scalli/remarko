import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from '@angular/router';
import { EditPasswordForm } from '../model/EditPasswordForm.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(
    private model: Model,
    private formBuilder: FormBuilder,
    activeRoute: ActivatedRoute,
    private router: Router) { }
    
    
    passwordsMatch: boolean;
    oldPasswordCorrect: boolean;
    HTMLtext;
    //Make sure password is only changed once each time
    pwchanged: boolean

  passwordForm: FormGroup;

  ngOnInit() {
    this.initForms();
    this.oldPasswordCorrect = true;
    this.HTMLtext = JSON.parse(localStorage.getItem('multiLangText'));
    this.pwchanged = false;

    
    this.model.studentPasswordUpdated.subscribe(
      data =>{
        //Password can now be changed again
        this.pwchanged = false;
        console.log("studentPasswordUpdated");
      },
      error => {
        //Password can now be changed again
        this.pwchanged = false;
      }
    );
    
    //Only try to save if old password is valid
    this.model.passwordValid.subscribe(
      data => {
//        this.pwvalid = true;
        console.log("passwordvalid");
        console.log(data);
        if(data && !this.pwchanged){
          this.saveEditedPassword2();
          this.pwchanged = true;
        }
        else {
          if(!data) {
            console.log("invalid password")
          }
          if(this.pwchanged) {
            console.log("Password was already changed");
          }
        }
      },
      error => {
        console.log("Error while saving with valid old password.")
      }
    );
  }

  saveEditedPassword2(){
//    if(this.pwvalid){
      console.log("saveEditedPassword2");
      let newpw = this.passwordForm.get('newpassword').value;
      let newpwagain = this.passwordForm.get('newpasswordagain').value;
      if(newpw == newpwagain && newpw.length>0){
        let userId = (JSON.parse(localStorage.getItem('currentUser'))).id;
        this.model.updateStudentPassword(new EditPasswordForm(userId,newpw));
      }
      this.passwordForm.setValue(
        {
          oldpassword:'',
          newpassword:'',
          newpasswordagain:''
        }
      );
      //Password can now be changed again
      // this.pwchanged = false;
      // this.oldPasswordCorrect = true;
//      }
    }
  
  saveEditedPassword(){
    let userId = (JSON.parse(localStorage.getItem('currentUser'))).id;
    let pw = this.passwordForm.get('oldpassword').value;
//    let correctPW = 
    this.model.validatePassword(
        {
          id: userId,
          password: pw
        }
    );
//    console.log("correctPW: " + correctPW);
    // if(!correctPW){
    //   this.oldPasswordCorrect = false;
    // }
    // else {
    //   this.oldPasswordCorrect = true;
    // }
  }

  checkPasswordMatchEdit(){
    console.log("checking password match... ");
    if(this.passwordForm.get('newpassword').value == this.passwordForm.get('newpasswordagain').value ){
      console.log("checkPasswordMatchEdit: true");
      this.passwordsMatch = true;
    }
    else {
      console.log("false");
      this.passwordsMatch = false;
    }
  }

    //Our own custom validator for checking password and passwordagain match
    private passwordMatchValidator(group: FormGroup): any {
      if (group) {
        console.log("checking password match with validator: ");
        console.log("newpassword: " + group.get("newpassword").value);
        console.log("newpasswordagain: " + group.get("newpasswordagain").value);
        if (group.get("newpassword").value !==group.get("newpasswordagain").value) {
          return { notMatching : true };
        }
      }
      return null;
    }

  private initForms(){
    this.passwordForm = this.formBuilder.group ({
      oldpassword: ['', Validators.required],
      newpassword: ['', Validators.required],
      newpasswordagain: ['', Validators.required]
    })
    this.passwordForm.setValidators(this.passwordMatchValidator);

  }
}
