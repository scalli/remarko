import {Role} from "./role.model";
import {Schoolyear} from "./schoolyear.model";
import { Class_schoolyear } from './class_schoolyear.model';

export class SignupUser {

    constructor(public firstName?: string,
                public lastName?: string,
                public email?: string,
                public username?: string,
                public password?: string,
                public language?: string,
                public lastLoginDate?: string,
                public active?: boolean,
                public role?: number,
                public class1_id?: number){}
                //Leave empty if it's a teacher
                //public schoolyear?: Schoolyear,
                //Leave empty if it's a teacher
                //public schoolClass?: string,
                //Place to add errors when signin up
                //public error?: string) {}
    
    toString(): string{
        return this.firstName;
    }
}