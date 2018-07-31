import { PmvFinancialAssignment } from "./pmv-financial-assignment.model";

export class PmvSubHeading {
    id: number;
    subHeading: string;
    headingId: number;
    assignmentItems: PmvFinancialAssignment[];
}