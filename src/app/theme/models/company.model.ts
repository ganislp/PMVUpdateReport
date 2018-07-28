export class Company {
    id: number;
    companyName: string;
    companyType: string;
    years: Year[];
}

export class Year {
    id: number;
    year: number;
    quarters: Quarter[];
}

export class Quarter {
    id: number;
    quarter: string;
}


