
import { Injectable } from "@angular/core";
import { HttpHelperService } from "./http-helper.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PmvHeading } from "../models/pmv-heading.model";
import { PmvSubHeading } from "../models/pmv-subheading.model";
import { PmvQuestion } from "../models/pmv-question.model";
import { Response } from "../models/response.model";
import { Project } from "../models/project.model";
import { Company } from "../models/company.model";
import { CompanyType } from "../models/company-type.model";
import { Client } from "../models/client.model";
import {QuestionType} from "../models/question-type.model";




@Injectable()

export class AdminManagedService {

    constructor(private httpHelper: HttpHelperService, private http: HttpClient, ) { }

    getPmvHeadings = (): Observable<PmvHeading[]> => {
        return this.httpHelper.getDataWithoutAuthentication<PmvHeading[]>('getPmvHeadings');
    }

    getPmvSubHeadingsByHeadingId = (headingId: number): Observable<PmvSubHeading[]> => {
        return this.httpHelper.getDataWithoutAuthentication<PmvSubHeading[]>('getPmvSubHeadings' + "?" + "headingId=" + headingId);
    }

    getQuestionsByHeadingIdAndSubHeadingId = (headingId: number, subHeadingId: number): Observable<PmvQuestion[]> => {
        return this.httpHelper.getDataWithoutAuthentication<PmvQuestion[]>('getQuestions' + "?" + "headingId=" + headingId + "&" + "subheadingId=" + subHeadingId);
    }

    updatePmvQuestion = (request: PmvQuestion): Observable<Response> => {
        return this.httpHelper.putDataWithoutAuthentication<Response>('getQuestions/' + request.id, request);
    }

    addPmvQuestion = (request: PmvQuestion): Observable<Response> => {
        return this.httpHelper.postDataWithoutAuthentication<Response>('getQuestions', request);
    }

    getQuestionTypes = (): Observable<QuestionType[]> => {
        return this.httpHelper.getDataWithoutAuthentication<QuestionType[]>('getQuestionTypes');
    }



    updatePmvHeading = (request: PmvHeading): Observable<Response> => {
        return this.httpHelper.putDataWithoutAuthentication<Response>('getPmvHeadings/' + request.id, request);
    }

    addPmvHeading = (request: PmvHeading): Observable<Response> => {
        return this.httpHelper.postDataWithoutAuthentication<Response>('getPmvHeadings', request);
    }

    updatePmvSubHeading = (request: PmvSubHeading): Observable<Response> => {
        return this.httpHelper.putDataWithoutAuthentication<Response>('getPmvSubHeadings/' + request.id, request);
    }

    addPmvSubHeading = (request: PmvSubHeading): Observable<Response> => {
        return this.httpHelper.postDataWithoutAuthentication<Response>('getPmvSubHeadings', request);
    }


    getProjects = (): Observable<Project[]> => {
        return this.httpHelper.getDataWithoutAuthentication<Project[]>('getProjects');
    }

    getCompanies = (projectId: number): Observable<Company[]> => {
        return this.httpHelper.getDataWithoutAuthentication<Company[]>('getCompanies' + "?" + "projectId=" + projectId);
    }

    getCompanyTypes = (): Observable<CompanyType[]> => {
        return this.httpHelper.getDataWithoutAuthentication<CompanyType[]>('getCompanyTypes');
    }

    getClients = (): Observable<Client[]> => {
        return this.httpHelper.getDataWithoutAuthentication<Client[]>('getClients');
    }
}