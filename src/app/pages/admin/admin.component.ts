import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog, MatTableDataSource, MatSort, MatPaginator, MatSnackBar } from '@angular/material';


import { ApiService } from '../../theme/services';
import { AddItemComponent } from './add-item-dialog/add-item-dialog.component'
import { Item, Question, ItemTypes } from './add-item-dialog/item.model';
import { AdminManagedService } from "../../theme/services/admin-managedata.service";
import { PmvHeading } from "../../theme/models/pmv-heading.model";
import { PmvSubHeading } from "../../theme/models/pmv-subheading.model";
import { PmvQuestion } from "../../theme/models/pmv-question.model";
import { Response } from "../../theme/models/response.model";
import {QuestionType} from "../../theme/models/question-type.model";





@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  selectedHeading: string;
  selectedSubHeading: string;
  subscriptions = [];
  showSpinner: boolean;
  selectedHeadingId: number = -1;
  selectedSubHeadingId: number = -1;
  pmvHeadings: PmvHeading[];
  pmvSubHeadings: PmvSubHeading[];
  pmvSubHeadingsFilter: PmvSubHeading[];
  pmvQuestions: PmvQuestion[];
  pmvQuestionsFilter: PmvQuestion[];
  questionTypes:QuestionType[];

  //Mat table variables
  pmvHeadingDisplayedColumns: string[] = ['id', 'heading', 'edit'];
  pmvSubHeadingDisplayedColumns: string[] = ['id', 'subHeading', 'edit'];
  displayedColumnsQuestions: string[] = ['id', 'question','questionType', 'edit'];
  headingsDataSource: MatTableDataSource<PmvHeading>;
  subHeadingsDataSource: MatTableDataSource<PmvSubHeading>;
  pmvQuestionsDataSource: MatTableDataSource<PmvQuestion>;


  @ViewChild('pmvHeadingsPaginator') pmvHeadingsPaginator: MatPaginator;
  @ViewChild('pmvHeadingSort') pmvHeadingsSort: MatSort;
  @ViewChild('pmvSubheadingsPaginator') pmvSubheadingsPaginator: MatPaginator;
  @ViewChild('pmvSubheadingsSort') pmvSubheadingsSort: MatSort;
  @ViewChild('pmvQuestionsPaginator') pmvQuestionsPaginator: MatPaginator;
  @ViewChild('pmvQuestionsSort') pmvQuestionsSort: MatSort;

  constructor(private apiService: ApiService, private adminManagedService: AdminManagedService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }


  getPmvHeadings = (): void => {
    this.adminManagedService.getPmvHeadings().subscribe(
      (response) => {
        response = this.pmvHeadings = response;
        this.showSpinner = true;
        this.headingsDataSource = new MatTableDataSource<PmvHeading>(this.pmvHeadings);
        this.setUpSortingAndPagination("pmvHeadings");
      }
      , (error) => {
        this.showSpinner = false;
        console.log(error);
      }
    );

  }

  getPmvSubHeadings = (): void => {
    this.adminManagedService.getPmvSubHeadings().subscribe(
        (response) => {
          response = this.pmvSubHeadings = response;

        }
        , (error) => {
          this.showSpinner = false;
          console.log(error);
        }
    );

  }


  getQuestionTypes = (): void => {
    this.adminManagedService.getQuestionTypes ().subscribe(
        (response) => {
          response = this.questionTypes = response;
        }
        , (error) => {
          this.showSpinner = false;
          console.log(error);
        }
    );

  }

  getTypeDescription = (id: number): string =>{
    return this.questionTypes.find( item => item.id == id) ? this.questionTypes.find( item => item.id == id).questionType : '';
  }


  getQuestions = (): void => {
    this.adminManagedService.getQuestions().subscribe(
      (response) => {
        response = this.pmvQuestions = response;

      }
      , (error) => {
        this.showSpinner = false;
        console.log(error);
      }
    );

  }


  highlight(tableName: string, row: PmvHeading) {
    if (tableName == "pmvSubheadings") {
      this.selectedHeadingId = row.id;
      this.selectedSubHeadingId = -1;
    } else if (tableName == "pmvQuestions") {
      this.selectedSubHeadingId = row.id;
    }
    if (this.selectedHeadingId > 0 && this.selectedSubHeadingId > 0) {
     this.pmvQuestionsFilter = this.pmvQuestions.filter(x => x.headingId === this.selectedHeadingId && x.subheadingId === this.selectedSubHeadingId)
      this.showSpinner = true;
      this.pmvQuestionsDataSource = new MatTableDataSource<PmvQuestion>(this.pmvQuestionsFilter);
      this.setUpSortingAndPagination("pmvQuestions");

    }
    if (this.selectedHeadingId >= 0 && this.selectedSubHeadingId < 0) {
      this.pmvSubHeadingsFilter =  this.pmvSubHeadings.filter(x => x.headingId === this.selectedHeadingId)
      this.showSpinner = true;
      this.subHeadingsDataSource = new MatTableDataSource<PmvSubHeading>(this.pmvSubHeadingsFilter);
      this.setUpSortingAndPagination("pmvSubheadings");
    }
    /* else if(tableName == "pmvQuestions") {
       this.selectedSubHeadingId = row.id;
       if (this.selectedHeadingId > 0 && this.selectedSubHeadingId > 0) {
         this.getQuestionsByHeadingIdAndSubHeadingId(this.selectedHeadingId, this.selectedSubHeadingId);
         this.showSpinner = true;
       }
     }*/
  }

  highlightQuestions(tableName: string, row: PmvSubHeading) {


  }

  applyFilterHeadings(filterValue: string) {
    this.headingsDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterSubHeadings(filterValue: string) {
    this.subHeadingsDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterQuestions(filterValue: string) {
    this.pmvQuestionsDataSource.filter = filterValue.trim().toLowerCase();
  }

  private setUpSortingAndPagination(tableName: string) {
    console.log("Table name......." + tableName);
    if (tableName == "pmvHeadings") {
      this.headingsDataSource.paginator = this.pmvHeadingsPaginator;
      this.headingsDataSource.sort = this.pmvHeadingsSort;
    } else if (tableName == "pmvSubheadings") {
      this.subHeadingsDataSource.paginator = this.pmvSubheadingsPaginator;
      this.subHeadingsDataSource.sort = this.pmvSubheadingsSort;
    } else if (tableName == "pmvQuestions") {
      this.pmvQuestionsDataSource.paginator = this.pmvQuestionsPaginator;
      this.pmvQuestionsDataSource.sort = this.pmvQuestionsSort;
    }
  }

  public updateQuestion(pmvQuestion: PmvQuestion) {
    this.adminManagedService.updatePmvQuestion(pmvQuestion).subscribe(
      updateUserResponse => {
        // this.getUsers()
        //this.notificationsService.notify('info', '', updateUserResponse.message);
      },
      (errorResponse: Response) => {
        console.log(errorResponse);
        //this.notificationsService.notify('error', '', errorResponse.error.toString());

      });


  }

  public addPmvQuestion(pmvQuestion: PmvQuestion) {
    this.adminManagedService.addPmvQuestion(pmvQuestion).subscribe(
      updateUserResponse => {
        // this.getUsers()
        //this.notificationsService.notify('info', '', updateUserResponse.message);
      },
      (errorResponse: Response) => {
        console.log(errorResponse);
        //this.notificationsService.notify('error', '', errorResponse.error.toString());

      });


  }

  public updatePmvHeading(pmvHeading: PmvHeading) {
    this.adminManagedService.updatePmvHeading(pmvHeading).subscribe(
      updateUserResponse => {
        // this.getUsers()
        //this.notificationsService.notify('info', '', updateUserResponse.message);
      },
      (errorResponse: Response) => {
        console.log(errorResponse);
        //this.notificationsService.notify('error', '', errorResponse.error.toString());

      });


  }

  public addPmvHeading(pmvHeading: PmvHeading) {
    this.adminManagedService.addPmvHeading(pmvHeading).subscribe(
      updateUserResponse => {
        // this.getUsers()
        //this.notificationsService.notify('info', '', updateUserResponse.message);
      },
      (errorResponse: Response) => {
        console.log(errorResponse);
        //this.notificationsService.notify('error', '', errorResponse.error.toString());

      });


  }

  public updateSubPmvHeading(pmvSubHeading: PmvSubHeading) {
    this.adminManagedService.updatePmvSubHeading(pmvSubHeading).subscribe(
      updateUserResponse => {
        // this.getUsers()
        //this.notificationsService.notify('info', '', updateUserResponse.message);
      },
      (errorResponse: Response) => {
        console.log(errorResponse);
        //this.notificationsService.notify('error', '', errorResponse.error.toString());

      });


  }

  public addSubPmvHeading(pmvSubHeading: PmvSubHeading) {
    this.adminManagedService.addPmvSubHeading(pmvSubHeading).subscribe(
      updateUserResponse => {
        // this.getUsers()
        //this.notificationsService.notify('info', '', updateUserResponse.message);
      },
      (errorResponse: Response) => {
        console.log(errorResponse);
        //this.notificationsService.notify('error', '', errorResponse.error.toString());

      });


  }



  ngOnInit() {
    this.showSpinner = true;
    this.getPmvHeadings();
     this.getPmvSubHeadings();
     this.getQuestions();
     this.getQuestionTypes();
    /*this.subscriptions.push(this.adminManagedService.getPmvHeadings().subscribe((response) => {
      this.pmvHeadings = response;
      this.showSpinner = false;
      this.headingsDataSource = new MatTableDataSource<PmvHeading>(this.pmvHeadings);
      this.subHeadingsDataSource = new MatTableDataSource<PmvHeading>(this.pmvHeadings);
      this.setUpSortingAndPagination("headings");
      this.setUpSortingAndPagination("subheadings");
    }, (error) => {
      this.showSpinner = false;
      console.log("Error retrieving deals");
    }));*/

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }



  public openAddEditItemDialog(itemType: ItemTypes, item: Item | PmvQuestion | PmvHeading | PmvSubHeading ) {

    let dialogRef = this.dialog.open(AddItemComponent, {
      data: { itemType: itemType, item: item }

    });

    dialogRef.afterClosed().subscribe(item => {
      if (item) {
        (item.id) ? this.updateItem(itemType, item) : this.addItem(itemType, item);
      }
    });

  }





  private updateItem(itemType: ItemTypes, item: Item | PmvQuestion | PmvHeading | PmvSubHeading) {
    let index: number;

    if (itemType == ItemTypes.questions) {
      this.updateQuestion(<PmvQuestion>item);
      /*index = this.pmvQuestions.findIndex(el => el.questionId == item.id);
      this.pmvQuestions.splice(index, 0, item);*/
    }
    else if (itemType == ItemTypes.headings) {
      this.updatePmvHeading(<PmvHeading>item);
    }

    else if (itemType == ItemTypes.subheadings) {
      this.updateSubPmvHeading(<PmvSubHeading>item);
    }

    /* else {
       if (!this.pmvSubHeadings) this.pmvSubHeadings = [];
       this.pmvSubHeadings.push(item | PmvSubHeading);
     }*/

    //new this.findAndReplaceInArray(itemType == ItemTypes.questions ? this.questions : (itemType == ItemTypes.headings
    // ? this.headings : this.subheadings), item);
  }

  /*  private findAndReplaceInArray(arr: any[], item: Item | Question) {
      let index = arr.findIndex(el => el.id == item.id);
      arr[index] = item;
      this.openSnackBar('Save Successful!!!', '');    
    }*/

  private addItem(itemType: ItemTypes, item: Item | PmvQuestion | PmvHeading | PmvSubHeading |QuestionType) {
    /*if (itemType == ItemTypes.questions) {
      if (!this.questions) this.questions = [];
      item.id = this.questions.length + 1;
      it
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
      item.headingid= this.selectedheadingid
      this.subheadings.push(<Item>item);
      this.setUpSortingAndPagination("subheadings");
      this.openSnackBar('Heading added Successfully!!!', '');
    }*/

    if (itemType == ItemTypes.headings) {
      if (!this.pmvHeadings) this.pmvHeadings = [];
      item.id = this.pmvHeadings.length + 1;
      //this.pmvHeadings.push(<PmvHeading>item);
      this.addPmvHeading(<PmvHeading>item);
      this.setUpSortingAndPagination("headings");
      this.openSnackBar('Heading added Successfully!!!', '');
    }

    else if (itemType == ItemTypes.subheadings) {
      if (!this.pmvSubHeadings) this.pmvSubHeadings = [];

      item.id = Math.round(Math.floor(Math.random() * (1000 - 100 + 1)) + 100);
      (<PmvSubHeading>item).headingId = this.selectedHeadingId;
      //this.pmvHeadings.push(<PmvHeading>item);
      this.addSubPmvHeading(<PmvSubHeading>item);
      this.setUpSortingAndPagination("pmvSubheadings");
      this.openSnackBar('SubHeading added Successfully!!!', '');

    }

    else if (itemType == ItemTypes.questions) {

      item.id = Math.round(Math.floor(Math.random() * (1000 - 100 + 1)) + 100);
    (<PmvQuestion>item).headingId = this.selectedHeadingId;
    (<PmvQuestion>item).subheadingId = this.selectedSubHeadingId;
    //  (<PmvQuestion>item).questionTypeId = item.id;
     // console.log("questionTypeId" +)
      this.addPmvQuestion(<PmvQuestion>item);
      this.setUpSortingAndPagination("pmvQuestions");
      this.openSnackBar('Question added Successfully!!!', '');
    }


  }



  /* getDescription(tableName: string, id: number) {
     if (id > 0) {
       return tableName == "headings" ? this.headings.find(item => item.id == id).name : this.headings.find(item => item.id == id).name;
     }
     return "";
   }*/




  /*  highlight(tableName: string, row: PmvHeading) {
      if (tableName == "headings") {
        this.selectedHeadingId = row.headingId;
      } else if (tableName == "subheadings") {
        this.selectedSubHeadingId = row.subHeadingId;
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
    }*/

  /*  deleteQuestion(q: Question): void {
      let index = this.questions.findIndex(qes => qes.id == q.id);
      this.questions.splice(index, 1);
      this.setUpSortingAndPagination("questions");
      this.openSnackBar('Question deleted Successfully!!!', '');
    }*/

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

}
