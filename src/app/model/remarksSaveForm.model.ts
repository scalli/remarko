export class RemarksSaveForm {

    constructor(
                public date?: string,
                public remark?: string,
                public extraInfo?: string,
                public severity?: number,
                public studentId?: number[],
                public teacherId?: number
                ) {}
}