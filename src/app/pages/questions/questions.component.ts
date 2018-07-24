import { Component, OnInit } from '@angular/core';
import { forkJoin } from "rxjs/observable/forkJoin";

import { ApiService } from '../../theme/services';
import { Subheading, Question, Deal } from '../admin/add-item-dialog/item.model';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
  providers: [ApiService]
})
export class QuestionsComponent implements OnInit {

  subscriptions = [];
  subheadings: Subheading[];
  questions: Question[];
  years: number[];
  quarters: string[];
  deals: Deal[];

  selectedDealId: number;
  selectedYear: number;
  selectedQuarter: string;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    let subscription = forkJoin([this.apiService.get("subheadings.json"), this.apiService.get("questions.json"),
    this.apiService.get("years.json"), this.apiService.get("quarters.json"), this.apiService.get("deals.json")]).subscribe(results => {
      this.subheadings = results[0];
      this.questions = results[1];
      this.years = results[2];
      this.quarters = results[3];
      this.deals = results[4];
      this.mapQuestionsToSubheadings();
    }, error => {
      console.log("Couldn't retrieve subheadings and question")
    });

    this.subscriptions.push(subscription)
  }

  ngOnDestroy() {
    if (this.subscriptions) this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
