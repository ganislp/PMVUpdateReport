import {QuestionType} from "./question-type.model";
export class PmvQuestion {
    id: number;
    headingId: number;
    subheadingId: number;
    questionType :QuestionType;
    question: string;
}