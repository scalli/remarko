import {Role} from "./role.model";
import { Class_schoolyear } from './class_schoolyear.model';

export class Student {

    constructor(public id?: number,
                public firstName?: string,
                public lastName?: string,
                public email?: string,
                public username?: string,
                public password?: string,
                public language?: string,
                public lastLoginDate?: string,
                public active?: boolean,
                // public roles?: Role[],
                // public classSchoolyears?: Class_schoolyear[]
                public role?: string,
                public class1_id?: string,
                public class1?: string,
                ){}
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