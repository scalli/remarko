import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Model } from "../model/repository.model";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";


@Component({
  selector: 'app-forgotpassword2',
  templateUrl: './forgotpassword2.component.html',
  styleUrls: ['./forgotpassword2.component.css']
})
export class Forgotpassword2Component implements OnInit {

  code: string; 
  schoolcode: string;

  passwordForm: FormGroup;

  passwordsMatch: boolean;

  constructor(
    private _Activatedroute:ActivatedRoute,
    private _router:Router,
    private model: Model,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.code=this._Activatedroute.snapshot.params['code'];
    console.log(this.code);
    this.schoolcode=this._Activatedroute.snapshot.params['schoolcode'];
    console.log(this.schoolcode);

    this.passwordForm = this.formBuilder.group ({
      password: ['', Validators.required],
      passwordagain: ['', Validators.required]
    })
    this.passwordForm.setValidators(this.passwordMatchValidator);
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
      if(this.passwordForm.get('password').value == this.passwordForm.get('passwordagain').value ){
        console.log("true");
        this.passwordsMatch = true;
      }
      else {
        console.log("false");
        this.passwordsMatch = false;
      }
    }

    changePassword(){
      console.log("Entering change password");
      this.model.forgotpassword2(this.code, this.schoolcode, this.passwordForm.get('password').value);
    }

}
