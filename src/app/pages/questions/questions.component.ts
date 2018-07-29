import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { forkJoin } from "rxjs/observable/forkJoin";
import { Subscription } from "rxjs/subscription";

import { ApiService } from '../../theme/services';
import { Subheading, Question, Deal } from '../admin/add-item-dialog/item.model';
import { AdminManagedService } from "../../theme/services/admin-managedata.service";
import { Project } from "../../theme/models/project.model";
import { Company, Year, Quarter } from "../../theme/models/company.model";
import { AssessmentItem } from '../../theme/models/assessment.model';
import { PmvQuestion } from '../../theme/models/pmv-question.model';
import { PmvSubHeading } from '../../theme/models/pmv-subheading.model';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
  providers: [ApiService]
})
export class QuestionsComponent implements OnInit {

  private subscription = new Subscription();
  subheadings: PmvSubHeading[];
  questions: PmvQuestion[];
  years: Year[];
  quarters: Quarter[];
  assessmentItems: AssessmentItem[];
  projects: Project[];
  companies: Company[];
  selectionForm: FormGroup;

  selectedProjectId = -1;
  selectedCompanyId = -1;
  selectedYearId = -1;
  selectedQuarterId = -1;

  userRole: string = 'dataCapturer';

  constructor(private apiService: ApiService, private adminManagedService: AdminManagedService, private fb: FormBuilder) { }

  ngOnInit() {
    this.selectionForm = this.fb.group({
      "projectId": [],
      "companyId": [],
      "assessmentYear": [{ disabled: true }],
      "assessmentQuarter": [{ disabled: true }]
    })

    this.subscription.add(forkJoin([this.adminManagedService.getProjects(), this.adminManagedService.getPmvSubHeadings(), this.adminManagedService.getPmvQuestions()]).subscribe(results => {
      this.projects = results[0]
      this.subheadings = results[1];
      this.questions = results[2];
      // this.mapQuestionsToSubheadings();
    }, error => {
      console.log("Couldn't retrieve subheadings and question")
    }));

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadCompanies(): void {
    this.selectedProjectId = this.selectionForm.controls["projectId"].value;
    this.selectionForm.controls["companyId"].setValue("");
    this.selectionForm.controls["assessmentYear"].setValue("");
    this.selectionForm.controls["assessmentQuarter"].setValue("");
    this.companies = this.projects.find(project => project.id == this.selectedProjectId) ?
      this.projects.find(project => project.id == this.selectedProjectId).companies : new Array<Company>();
  }

  private loadAssessment(): void {
    this.selectedCompanyId = this.selectionForm.controls["companyId"].value;
    this.years = this.companies.find(company => company.id == this.selectedCompanyId) ?
      this.companies.find(company => company.id == this.selectedCompanyId).years : new Array<Year>();
    this.quarters = this.years[0].quarters;
    this.selectionForm.controls["assessmentYear"].setValue(this.years[0].id);
    this.selectionForm.controls["assessmentQuarter"].setValue(this.quarters[0].id);
    //show loading spinner
    this.adminManagedService.getPreparedAssessment().subscribe(assessmentItems => {
      this.assessmentItems = assessmentItems;
      this.assessmentItems.forEach(item => {
        let question = this.questions && this.questions.find(q => q.id == item.questionId)
          ? this.questions.find(q => q.id == item.questionId) : null;
        if (question) {
          item.question = question.question;
          item.questionType = question.questionType.questionType;
        }
        item.status = (item.status == 'I' || item.status == 'S') ? 'A' : item.status;
      });
      this.mapAssessmentItemsToSubheadings();
    }, error => {
      console.log("Error retrieving the assessment questionaire", error);
    });
  }


  /* private loadYears(): void {
    this.selectedCompanyId = this.selectionForm.controls["companyId"].value;
    this.selectionForm.controls["assessmentYear"].setValue("");
    this.selectionForm.controls["assessmentQuarter"].setValue("");
    this.years = this.companies.find(company => company.id == this.selectedCompanyId) ?
      this.companies.find(company => company.id == this.selectedCompanyId).years : new Array<Year>();
  }

  private loadQuarters(): void {
    this.selectedYearId = this.selectionForm.controls["assessmentYear"].value;
    this.selectionForm.controls["assessmentQuarter"].setValue("");
    this.quarters = this.years.find(year => year.id == this.selectedYearId) ?
      this.years.find(company => company.id == this.selectedYearId).quarters : new Array<Quarter>();
  } */

  private mapAssessmentItemsToSubheadings() {
    this.subheadings.forEach(subheading => {
      let relatedQuestions = this.questions.filter(q => q.subheadingId == subheading.id);
      subheading.assessmentItems = this.assessmentItems.filter(item => relatedQuestions.some(q => q.id == item.questionId)) || [];
    })
  }

  save(subheading: Subheading) {
    //Call the api to save all the questions
  }
}
