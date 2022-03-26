import { Injectable } from  "@angular/core";
import { CanActivate , ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export class LoginActivate implements CanActivate {

    constructor (
        private router : Router
    ) { }

    /**
     * Check if the user is logged in before calling http
     *
     * @param route
     * @param state
     * @returns {boolean}
     */
    canActivate (
        route : ActivatedRouteSnapshot,
        state : RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if(localStorage.getItem('accessToken')){
            return true;
        }
        this.router.navigate(['/login'],{ queryParams: { returnUrl: state.url }});
        return;
    }
}