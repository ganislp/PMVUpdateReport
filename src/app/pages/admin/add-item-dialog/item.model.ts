export class Item {
    name: string;
    id: number;
}

export class SubItem {
    name: string;
    id: number;
}

export class Question {
    id: number;
    headingId: number;
    subheadingId: number;
    question: string;
    answer: string;
}

export class Heading {
    id: number;
    subheadingId: number;
    name: string;
}

export class Subheading {
    id: number;
    headingId: number;
    name: string;
    questions: Question[];
}

export class Deal {
    id: number;
    name: string;
}

export enum ItemTypes {
    headings = 1,
    subheadings = 2,
    questions = 3
}