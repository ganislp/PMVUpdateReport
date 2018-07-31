import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { forkJoin } from "rxjs/observable/forkJoin";
import { Subscription } from "rxjs/Subscription";
import { MatDialog, MatSnackBar } from '@angular/material';

import { ApiService } from '../../theme/services';
import { Subheading, Question, Deal } from '../admin/add-item-dialog/item.model';
import { AdminManagedService } from "../../theme/services/admin-managedata.service";
import { FeedbackDialogComponent } from './feedback-dialog/feedback-dialog.component';

import {
  Project,
  Year,
  Quarter,
  AssessmentItem,
  PmvSubHeading,
  PmvQuestion,
  Company,
  MasterCompanyAssignment,
  MasterAssignment,
  PmvFinancialAssignment
} from '../../theme/models';

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
  companyAssessments: MasterCompanyAssignment[] = [];
  masterAssignments: MasterAssignment[] = [];
  selectionForm: FormGroup;

  selectedProjectId = -1;
  selectedCompanyId = -1;
  selectedYearId = -1;
  selectedQuarterId = -1;

  selectedCompanyAssignment: MasterCompanyAssignment;
  masterAssignment: MasterAssignment;
  financialAssignment: PmvFinancialAssignment[];

  userRole: string = 'dataCapturer';

  constructor(private apiService: ApiService,
    private adminManagedService: AdminManagedService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.selectionForm = this.fb.group({
      "projectId": [],
      "companyAssignment": [],
      "assessmentYear": [],
      "assessmentQuarter": []
    })

    this.subscription.add(forkJoin([this.adminManagedService.getProjects(), this.adminManagedService.getPmvSubHeadings(),
    this.adminManagedService.getPmvQuestions(), this.adminManagedService.getMasterAssignment()])
      .subscribe(results => {
        this.projects = results[0];
        this.subheadings = results[1];
        this.questions = results[2];
        this.masterAssignments = results[3];
        this.cdRef.detectChanges();
      }, error => {
        console.log("Couldn't retrieve subheadings and question");
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadCompanies(): void {
    this.selectedProjectId = this.selectionForm.controls["projectId"].value;
    this.selectionForm.controls["companyAssignment"].setValue("");
    this.selectionForm.controls["assessmentYear"].setValue("");
    this.selectionForm.controls["assessmentQuarter"].setValue("");
    this.subscription.add(forkJoin([this.adminManagedService.getCompaniesByProjectId(this.selectedProjectId), this.adminManagedService.getPendingAssessments(this.selectedProjectId)])
      .subscribe(response => {
        this.companies = response[0];
        this.companyAssessments = response[1];
        this.cdRef.detectChanges();
      }, error => {
        console.log("Couldn't retrieve company assignment");
      })
    );
    /* this.companies = this.projects.find(project => project.id == this.selectedProjectId) ?
      this.projects.find(project => project.id == this.selectedProjectId).companies : new Array<Company>(); */
  }

  getCompanyNameAndType = (companyId: number): any => {
    return this.companies.find(comp => comp.id == companyId)
      ? { name: this.companies.find(comp => comp.id == companyId).companyName, type: this.companies.find(comp => comp.id == companyId).companyType }
      : null;
  }

  private loadAssignment(): void {
    this.selectedCompanyAssignment = this.selectionForm.controls["companyAssignment"].value;
    let masterAssignment = this.masterAssignments.find(ma => ma.id == this.selectedCompanyAssignment.masterAssignmentId);
    this.selectionForm.controls["assessmentYear"].setValue(masterAssignment.fiscalYear);
    this.selectionForm.controls["assessmentQuarter"].setValue(masterAssignment.quarter);
    this.subscription.add(this.adminManagedService.getFinancialAssignment(this.selectedCompanyAssignment.id)
      .subscribe(assignmentItems => {
        this.financialAssignment = assignmentItems;
        this.mapAssignmentItemsToSubheadings();
        console.log("Subheadings", this.subheadings);
        console.log("Questions", this.questions);
        this.cdRef.detectChanges();
      }, error => {
        console.log("Error retrieving the assignment information", error);
      })
    );
    /* this.years = this.companies.find(company => company.id == this.selectedCompanyId) ?
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
          item.questionType = question.questionTypeId;
        }
        item.status = (item.status == 'I' || item.status == 'S') ? 'A' : item.status;
      });
      this.mapAssessmentItemsToSubheadings();
    }, error => {
      console.log("Error retrieving the assessment questionaire", error);
    }); */
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

  private mapAssignmentItemsToSubheadings = (): void => {
    this.subheadings.forEach(subheading => {
      let relatedQuestions = this.questions.filter(q => q.subheadingId == subheading.id);
      subheading.assignmentItems = this.financialAssignment.filter(item => {
        item.answerStatusTypeId = 4;
        return relatedQuestions.some(q => q.id == item.pmvQuestionId)
      }) || [];
    })
  }

  private getQuestionType = (pmvQuestionId: number): number => {
    return this.questions.find(q => q.id == pmvQuestionId) ? this.questions.find(q => q.id == pmvQuestionId).questionTypeId : 1;
  }

  private getQuestionText = (pmvQuestionId: number): string => {
    return this.questions.find(q => q.id == pmvQuestionId) ? this.questions.find(q => q.id == pmvQuestionId).question : "";
  }

  private approveReject = (asignmentItem: PmvFinancialAssignment): void => {
    if (asignmentItem.answerStatusTypeId == 5) {
      this.openFeedbackDialog(asignmentItem);
    }
  }

  private openFeedbackDialog(asignmentItem: PmvFinancialAssignment) {

    let dialogRef = this.dialog.open(FeedbackDialogComponent, {
      data: asignmentItem
    });

    dialogRef.afterClosed().subscribe(feedback => {
      if (feedback) {
        asignmentItem.reviewerFeedback = feedback;
      }
    });
  }


  save(subheading: Subheading) {
    //Call the api to save all the questions
  }
}
