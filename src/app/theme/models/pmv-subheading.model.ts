import { AssessmentItem } from "./assessment.model";

export class PmvSubHeading {
    id: number;
    subHeading: string;
    headingId: number;
    assessmentItems: AssessmentItem[];
}