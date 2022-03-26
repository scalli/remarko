import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { Model } from "../model/repository.model";

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  email: String;
  emailForm: FormGroup;

  constructor(    
    private model: Model,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.emailForm = this.formBuilder.group ({
      email: ['', [Validators.email, Validators.required]],
      schoolcode: ['', Validators.required]
    });
    localStorage.setItem("NoSuchUserError","0");
    localStorage.setItem("NoSuchSchoolcode","0");
  }

  sendMail(){
    console.log(this.emailForm.get('email').value);
    console.log(this.emailForm.get('schoolcode').value);
    this.model.forgotpassword1(this.emailForm.get('email').value, this.emailForm.get('schoolcode').value);
  }

  isMailError(){
    if(localStorage.getItem('MailError') && localStorage.getItem('MailError') == "1"){
      return true;
    }
    return false;
  }

  isNoSuchUserError(){
    if(localStorage.getItem('NoSuchUserError') == "1"){
      return true;
    }
    return false;
  }

  NoSuchSchoolcodeError(){
    if(localStorage.getItem('NoSuchSchoolcode') == "1"){
      return true;
    }
    return false;
  }

  // onEmailChange(value: string) {
  //   console.log(value);
  //   localStorage.setItem('EmailText',value);
  // }
}
