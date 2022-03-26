import { Component, OnInit } from '@angular/core';
import { Model } from "../model/repository.model";
import { ActivatedRoute, Router } from '@angular/router';
import { Myresponse } from '../model/myresponse.model';

@Component({
  selector: 'app-confirmadminfinal',
  templateUrl: './confirmadminfinal.component.html',
  styleUrls: ['./confirmadminfinal.component.css']
})
export class ConfirmadminfinalComponent implements OnInit {

  schoolcodeInternal: string;
  confirmationuid: string;
  adminConfirmed: string;

  constructor( private model: Model,
    private activeRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
      this.adminConfirmed = "Waiting for confirmation...";

      this.activeRoute.queryParamMap.subscribe(queryParams => {
        this.schoolcodeInternal = queryParams.get("schoolcodeInternal");
        this.confirmationuid = queryParams.get("confirmationuid");
        console.log(this.schoolcodeInternal);
        console.log(this.confirmationuid);
        this.model.confirmadmin2(this.schoolcodeInternal, this.confirmationuid);
      });

      this.model.adminConfirmed.subscribe(
        (myresponse: Myresponse) => {
          console.log(myresponse.text);
          // this.adminConfirmed = myresponse.text;
          if(myresponse.text == "Confirmed"){
            this.adminConfirmed = "Congratulations, confirmation succeeded! You can now start using Notatis for your school!";
          }
          else {
            this.adminConfirmed = "Oops! It seems like something went wrong.\n Please contact our helpdesk via info@notatis.com";
          }
        }
      );
  }

}
