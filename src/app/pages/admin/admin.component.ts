import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog, MatTableDataSource, MatSort, MatPaginator, MatSnackBar } from '@angular/material';


import { ApiService } from '../../theme/services';
import { AddItemComponent } from './add-item-dialog/add-item-dialog.component'
import { Item, Question, ItemTypes } from './add-item-dialog/item.model';
import {AdminManagedService} from "../../theme/services/admin-managedata.service";
import {PmvHeading} from "../../theme/models/pmv-Heading.model";



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  selectedHeading: string;
  selectedSubHeading: string;
  subscriptions = [];
  headings: Item[];
  subheadings: Item[];
  questions: Question[];
  showSpinner: boolean;
  selectedHeadingId: number = -1;
  selectedSubHeadingId: number = -1;
  pmvHeadings: PmvHeading[];

  //Mat table variables
  displayedColumns: string[] = ['headingId', 'heading'];
  displayedColumnsQuestions: string[] = ['id', 'question', 'edit', 'delete'];
  headingsDataSource: MatTableDataSource<PmvHeading>;
  subHeadingsDataSource: MatTableDataSource<PmvHeading>;
  questionsDataSource: MatTableDataSource<Question>;

  @ViewChild('headingsPaginator') headingsPaginator: MatPaginator;
  @ViewChild('headingSort') headingsSort: MatSort;
  @ViewChild('subheadingsPaginator') subheadingsPaginator: MatPaginator;
  @ViewChild('subheadingsSort') subheadingsSort: MatSort;
  @ViewChild('questionsPaginator') questionsPaginator: MatPaginator;
  @ViewChild('questionsSort') questionsSort: MatSort;

  constructor(private apiService: ApiService,private adminManagedService :AdminManagedService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }


  getPmvHeadings = (): void => {
    this.adminManagedService.getPmvHeadings().subscribe(
        (response) => {
          response = this.pmvHeadings = response;
        }
        , (error) => {
          console.log(error);
        }
    );

  }

  ngOnInit() {
    this.showSpinner = true;
    this.subscriptions.push(this.adminManagedService.getPmvHeadings().subscribe((response) => {
      this.pmvHeadings = response;
      this.showSpinner = false;
      this.headingsDataSource = new MatTableDataSource<PmvHeading>(this.pmvHeadings);
      this.subHeadingsDataSource = new MatTableDataSource<PmvHeading>(this.pmvHeadings);
      this.setUpSortingAndPagination("headings");
      this.setUpSortingAndPagination("subheadings");
    }, (error) => {
      this.showSpinner = false;
      console.log("Error retrieving deals");
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private setUpSortingAndPagination(tableName: string) {
    if (tableName == "headings") {
      this.headingsDataSource.paginator = this.headingsPaginator;
      this.headingsDataSource.sort = this.headingsSort;
    } else if (tableName == "subheadings") {
      this.subHeadingsDataSource.paginator = this.subheadingsPaginator;
      this.subHeadingsDataSource.sort = this.subheadingsSort;
    } else if (tableName == "questions") {
      this.questionsDataSource.paginator = this.questionsPaginator;
      this.questionsDataSource.sort = this.questionsSort;
    }
  }

  public openAddEditItemDialog(itemType: ItemTypes, item: Item | Question) {
    let dialogRef = this.dialog.open(AddItemComponent, {
      data: { itemType: itemType, item: item }
    });

    dialogRef.afterClosed().subscribe(item => {
      if (item) {
        (item.id) ? this.updateItem(itemType, item) : this.addItem(itemType, item);
      }
    });
  }

  private updateItem(itemType: ItemTypes, item: Item | Question) {
    /*  let index: number;
     if (itemType == ItemTypes.questions) {
       index = this.questions.findIndex(el => el.id == item.id);
       this.questions.splice(index, 0, item);
     } else if (itemType == ItemTypes.headings) {
       if (!this.headings) this.headings = [];
       this.headings.push(item);
     } else {
       if (!this.subheadings) this.subheadings = [];
       this.subheadings.push(item);
     } */

    this.findAndReplaceInArray(itemType == ItemTypes.questions ? this.questions : (itemType == ItemTypes.headings
      ? this.headings : this.subheadings), item);

  }

  private findAndReplaceInArray(arr: any[], item: Item | Question) {
    let index = arr.findIndex(el => el.id == item.id);
    arr[index] = item;
    this.openSnackBar('Save Successful!!!', '');    
  }

  private addItem(itemType: ItemTypes, item: Item | Question) {
    if (itemType == ItemTypes.questions) {
      if (!this.questions) this.questions = [];
      item.id = this.questions.length + 1;
      this.questions.push(<Question>item);
      this.setUpSortingAndPagination("questions");
      this.openSnackBar('Question added Successfully!!!', '');
    } else if (itemType == ItemTypes.headings) {
      if (!this.headings) this.headings = [];
      item.id = this.headings.length + 1;
      this.headings.push(<Item>item);
      this.setUpSortingAndPagination("headings");
      this.openSnackBar('Heading added Successfully!!!', '');
    } else {
      if (!this.subheadings) this.subheadings = [];
      item.id = this.subheadings.length + 1;
      this.subheadings.push(<Item>item);
      this.setUpSortingAndPagination("subheadings");
      this.openSnackBar('Heading added Successfully!!!', '');
    }
  }

  applyFilter(filterValue: string) {
    this.headingsDataSource.filter = filterValue.trim().toLowerCase();
  }

  getDescription(tableName: string, id: number) {
    if (id > 0) {
      return tableName == "headings" ? this.headings.find(item => item.id == id).name : this.headings.find(item => item.id == id).name;
    }
    return "";
  }

  highlight(tableName: string, row: Item) {
    if (tableName == "headings") {
      this.selectedHeadingId = row.id;
    } else if (tableName == "subheadings") {
      this.selectedSubHeadingId = row.id;
    }
    if (this.selectedHeadingId >= 0 && this.selectedSubHeadingId >= 0) {
      this.showSpinner = true;
      this.subscriptions.push(this.apiService.get("questions.json").subscribe((response) => {
        this.questions = response;
        this.questionsDataSource = new MatTableDataSource<Question>(this.questions);
        this.setUpSortingAndPagination("questions");
        this.showSpinner = false;
      }, (error) => {
        this.showSpinner = false;
        console.log("Error retrieving deals");
      }))
    }
  }

  deleteQuestion(q: Question): void {
    let index = this.questions.findIndex(qes => qes.id == q.id);
    this.questions.splice(index, 1);
    this.setUpSortingAndPagination("questions");
    this.openSnackBar('Question deleted Successfully!!!', '');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
