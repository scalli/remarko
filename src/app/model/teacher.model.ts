import {Role} from "./role.model";

export class Teacher {

    constructor(public id?: number,
                public firstName?: string,
                public lastName?: string,
                public email?: string,
                public username?: string,
                public password?: string,
                public language?: string,
                public lastLoginDate?: string,
                public active?: boolean,
                public roles?: Role[]) {}
}