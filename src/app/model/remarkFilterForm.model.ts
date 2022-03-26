export class RemarkFilterForm {

    constructor(
                public studentId?: number,
                public authorId?: number,
                public fromDate?: string,
                public toDate?: string,
                public severities?: number[],
                public schoolClassId?: number
                ) {}
}