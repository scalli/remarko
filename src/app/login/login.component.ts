import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition, sequence } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations:[
    trigger('EnterLeave', [
        state('flyIn', style({ transform: 'translateX(0)' })),
        transition('void => *', [
            style({ width: 10, transform: 'translateX(50px)', opacity: 0 }),
            sequence([
              // animate('0.3s 0.1s ease', style({
              //   transform: 'translateX(0)',
              //   width: 120
              // })),
              animate('0.3s ease', style({
                opacity: 1
              }))
            ])
          ])
      ])
]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginError: boolean;
 // signUpForm: FormGroup;

  constructor(  private model: Model,
                private formBuilder: FormBuilder,
                activeRoute: ActivatedRoute,
                private router: Router) 
  { 
    this.loginError = false;
  }

  ngOnInit() {

    this.initForms();

    this.loginError = false;

    this.model.studentLoggedIn.subscribe(
      (message: string) => {
        //Student logged in
        if(JSON.parse(localStorage.getItem('currentUser')).role < 3){
          this.router.navigate(['studentoverview']);
        }
        //Teacher or admin logged in
        else {
          this.router.navigate(['overview']);
        }
      }
    );

    this.model.loginFailed.subscribe(
      (message: string) => {
        this.loginError = true;
        console.log("loginerror");
        setTimeout(() => this.loginError=null,2000);
        //this.router.navigate(['login']);
      }
    )

  }

  private initForms(){
    this.loginForm = this.formBuilder.group ({
      username: ['', Validators.required],
      password: ['', Validators.required],
      schoolcode: ['', Validators.required]
    });

    if(localStorage.getItem('schoolcode') && localStorage.getItem('username')){
      this.loginForm.setValue(
        {
          schoolcode : localStorage.getItem('schoolcode'),
          password: "",
          username: localStorage.getItem('username')
        });
    }
  }

  onLogin(){
    //localStorage.clear();
    console.log("username: " + this.loginForm.get('username').value);
    console.log("password: " + this.loginForm.get('password').value);
    console.log("schoolcode: " + this.loginForm.get('schoolcode').value);
 //   localStorage.setItem('schoolcode',this.loginForm.get('schoolcode').value);
    this.model.login(this.loginForm.get('username').value, this.loginForm.get('password').value,
                this.loginForm.get('schoolcode').value);
    this.router.navigate(['overview']);
  }

}
