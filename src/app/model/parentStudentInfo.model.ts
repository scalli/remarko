export class ParentStudentInfo {

    constructor(	public parentId ?: number,
                    public parentFirstName ?: string,
                    public parentLastName ?: string,
                    public parentEmail ?: string,
                    public studentId?: number,
                    public studentFirstName ?: string,
                    public studentLastName ?: string,
                    public studentEmail ?: string,
                    public active ?: boolean,
                    public schoolClass  ?: string,) {}
}