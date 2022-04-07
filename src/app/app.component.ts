import { Component } from '@angular/core';
import { Model } from "./model/repository.model";
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'remarko';
  currentUser;
  currentUserRole;
  currentURL: string;
  HTMLtext: [];


  constructor( private model: Model,
                private router: Router,
                private meta: Meta) 
    { 
      meta.addTag({name: 'apple-mobile-web-app-capable', content: 'yes'});
      meta.addTag({name: 'mobile-web-app-capable', content: 'yes'});
      this.model.studentLoggedIn.subscribe(
        (message: string) => {
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          console.log("currentUser");
          console.log(this.currentUser);
          console.log(this.currentUser.role);
          this.currentUserRole = this.currentUser.role;
        }
      );
    }

  ngOnInit(){
    this.currentUser = localStorage.getItem('currentUser');
    this.currentURL = this.router.url;
    // console.log(this.currentURL);
//    this.HTMLtext = JSON.parse(localStorage.getItem('multiLangText'));

    this.router.events.subscribe((res) => { 
      // console.log(this.router.url,"Current URL");
      this.currentURL = this.router.url;
    })

    this.HTMLtext = JSON.parse(localStorage.getItem('multiLangText'));
    this.model.HTMLTextLoaded.subscribe(
      data => {
        this.HTMLtext = JSON.parse(localStorage.getItem('multiLangText'));
      }
    )
    // console.log("currentUser");
    // console.log(this.currentUser);
  }

  isValidPath(){
    if(this.currentURL == '/addremark'
      || this.currentURL == '/overview'
      || this.currentURL == '/settings'
      || this.currentURL == '/teachers'
      || this.currentURL == '/students'
      || this.currentURL == '/schoolsettings'
      || this.currentURL == '/studentoverview'
      || this.currentURL == '/studentranking'
      || this.currentURL == '/ranking'
      || this.currentURL == '/parents'){
        return true;
      }
      return false;
  }

  isAdmin(){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(/*this.currentUserRole &&*/ this.currentUser.role == 4){
      return true;
    }
    else {
      return false;
    }
  }

  isTeacher(){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(/*this.currentUserRole &&*/ this.currentUser.role == 3){
      return true;
    }
    else {
      return false;
    }
  }

  isStudent(){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(/*this.currentUserRole &&*/ this.currentUser.role == 1){
      return true;
    }
    else {
      return false;
    }
  }

  isParent(){
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if(/*this.currentUserRole &&*/ this.currentUser.role == 2){
        return true;
      }
      else {
        return false;
      }
  }

  logout(){
    this.model.logout();

    var schoolcode;
    if(localStorage.getItem('schoolcode')){
      schoolcode = localStorage.getItem('schoolcode');
    }

    var username;
    if(localStorage.getItem('username')){
      username = localStorage.getItem('username');
    }

    localStorage.clear();
    if(schoolcode){
      localStorage.setItem('schoolcode',schoolcode);
    }

    if(username){
      localStorage.setItem('username', username);
    }

  }

  addRemarkURL(){
    this.currentURL = this.router.url;
    console.log(this.currentURL);
  }

}
