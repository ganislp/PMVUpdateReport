import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { forkJoin } from "rxjs/observable/forkJoin";
import { Subscription } from "rxjs/subscription";

import { ApiService } from '../../theme/services';
import { Subheading, Question, Deal } from '../admin/add-item-dialog/item.model';
import { AdminManagedService } from "../../theme/services/admin-managedata.service";
import { Project } from "../../theme/models/project.model";
import { Company, Year, Quarter } from "../../theme/models/company.model";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
  providers: [ApiService]
})
export class QuestionsComponent implements OnInit {

  // subscriptions = [];
  private subscription = new Subscription();
  subheadings: Subheading[];
  questions: Question[];
  years: Year[];
  quarters: Quarter[];
  //deals: Deal[];
  projects: Project[];
  companies: Company[];
  selectionForm: FormGroup;

  selectedProjectId = -1;
  selectedCompanyId = -1;
  selectedYearId = -1;
  selectedQuarterId = -1;

  constructor(private apiService: ApiService, private adminManagedService: AdminManagedService, private fb: FormBuilder) { }

  ngOnInit() {
   this.selectionForm = this.fb.group({
      "projectId": [],
      "companyId": [],
      "assessmentYear": [],
      "assessmentQuarter": []
    })
    this.subscription.add(this.adminManagedService.getProjects().subscribe(projects => {
      this.projects = projects;
    }));

    /*     let subscription = forkJoin([this.apiService.get("subheadings.json"), this.apiService.get("questions.json"),
        this.apiService.get("years.json"), this.apiService.get("quarters.json"), this.adminManagedService.getProjects(),this.adminManagedService.getCompanies()]).subscribe(results => {
          this.subheadings = results[0];
          this.questions = results[1];
          this.years = results[2];
          this.quarters = results[3];
          this.projects = results[4];
          this.companies = results[5];
          this.mapQuestionsToSubheadings();
        }, error => {
          console.log("Couldn't retrieve subheadings and question")
        }); */

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

  private loadYears(): void {
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
  }

  private mapQuestionsToSubheadings() {
    this.subheadings.forEach(subheading => {
      subheading.questions = this.questions.filter(question => question.subheadingId == subheading.id) || [];
    })
  }

  save(subheading: Subheading) {
    //Call the api to save all the questions
  }
}
