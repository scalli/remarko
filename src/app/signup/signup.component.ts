import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Model } from "../model/repository.model";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { instantiateDefaultStyleNormalizer } from '@angular/platform-browser/animations/src/providers';
import { SignupSchool } from '../model/signupSchool.model';
import { School } from '../model/school.model';
import { SignupUser } from '../model/signupUser.model';
import {formatDate} from '@angular/common';
import { Class_schoolyear } from '../model/class_schoolyear.model';
import { Role } from '../model/role.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  passwordsMatch: boolean;

  constructor(    private _Activatedroute:ActivatedRoute,
    private _router:Router,
    private model: Model,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();

    //Second part of first signup step = actually creating the admin user for this school that just signed up 
    //This happens after below method signup() gets back a result
    this.model.schoolInfoUpdated.subscribe(
      (school: School) => {
        console.log('schoolInfoUpdated');
        console.log(school);

        let confirmationuid: string;
        // confirmationuid = school.confirmationuid;

        let signupUser: SignupUser;
        signupUser = new SignupUser();
        signupUser.firstName = this.signupForm.get("firstName").value;;
        signupUser.lastName = this.signupForm.get("lastName").value;
        signupUser.language = this.signupForm.get("language").value;
        signupUser.email = this.signupForm.get("email").value;
        signupUser.username = this.signupForm.get("email").value;
        signupUser.password = this.signupForm.get("password").value;
        signupUser.active = true;
        signupUser.class1_id =  0;
        signupUser.lastLoginDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
        signupUser.role = 4;

        //OLD CODE
        // let r:Role;
        // r = new Role();
        // r.id = 4;
        // r.name = "ROLE_ADMIN" + school.smartschoolplatform.slice(-1); //Get last character
        // signupUser.roles = [];
        // signupUser.roles.push(r);

        this.model.confirmadmin(signupUser, confirmationuid, school.smartschoolplatform);
      }
    );

    this.model.adminCreated.subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }

  signup(){
    console.log("entering signup");
    console.log(this.signupForm.get("firstName").value);

    let signup: SignupSchool  = new SignupSchool();
    signup.firstName = this.signupForm.get("firstName").value;
    signup.lastName = this.signupForm.get("lastName").value;
    signup.language = this.signupForm.get("language").value;
    signup.email = this.signupForm.get("email").value;
    signup.password = this.signupForm.get("password").value;
    signup.schoolName = this.signupForm.get("schoolName").value;
    signup.schoolCode = this.signupForm.get("schoolCode").value;
    signup.street = this.signupForm.get("street").value;
    signup.number = this.signupForm.get("number").value;
    signup.postalCode = this.signupForm.get("postalCode").value;
    signup.city = this.signupForm.get("city").value;
    signup.country = this.signupForm.get("country").value;
    signup.phone = this.signupForm.get("phone").value;

    this.model.updateSchoolInfo(signup);
  }

  initForm(){
    this.signupForm = this.formBuilder.group ({
      firstName: ['', Validators.required],
      lastName:  ['', Validators.required],
      email: ['', Validators.required],
      language: ['', Validators.required],
      password: ['', Validators.required],
      passwordagain: ['', Validators.required],
      schoolName: ['', Validators.required],
      schoolCode: ['', Validators.required],
      street: ['', Validators.required],
      number: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      phone: ['', Validators.required]
    })
    this.signupForm.setValidators(this.passwordMatchValidator);
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

      checkPasswordMatch(){
        console.log("checking password match... ");
        if(this.signupForm.get('password').value == this.signupForm.get('passwordagain').value ){
          console.log("true");
          this.passwordsMatch = true;
        }
        else {
          console.log("false");
          this.passwordsMatch = false;
        }
      }


}
