import { Component, OnInit } from '@angular/core';
import {Company} from "../../../theme/models/company.model";
import {AdminManagedService} from "../../../theme/services/admin-managedata.service";
import {FormBuilder, FormGroup, NgModel, Validators, FormControl} from "@angular/forms";
import { Subscription } from "rxjs/subscription";
import {SelectItem} from "primeng/components/common/selectitem";
import {MasterAssignment} from "../../../theme/models/master-assignment.model";
import {MasterCompanyAssignment} from "../../../theme/models/master-company-assignment.model";
import {PmvQuestion} from "../../../theme/models/pmv-question.model";
import {PmvFinancialAssignment} from "../../../theme/models/pmv-financial-assignment.model";


@Component({
  selector: 'app-create-financial-assignment',
  templateUrl: './create-financial-assignment.component.html',
  styleUrls: ['./create-financial-assignment.component.scss']
})
export class CreateFinancialAssignmentComponent implements OnInit {
  private subscription = new Subscription();
  companies: Company[];
  pmvQuestions:PmvQuestion[];
  masterCompanyAssignment:MasterCompanyAssignment[];
  selectionForm: FormGroup;
  showSpinner: boolean;
  //selectCompanies: SelectItem[] = [];
  //selectedCompanies: Company[];
  masterAssignments:MasterAssignment[];
  masterAssignment:MasterAssignment = new MasterAssignment();
  constructor(private adminManagedService: AdminManagedService, private fb: FormBuilder) {

  }

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

  selectAll(select: NgModel, values, array) {
    select.update.emit(values);
  }

  deselectAll(select: NgModel) {
    select.update.emit([]);
  }
    getCompanies = (): void => {
        this.adminManagedService.getCompanies().subscribe(
            (response) => {
                response = this.companies = response;
                this.showSpinner = true;
            }
            , (error) => {
                this.showSpinner = false;
                console.log(error);
            }
        );

    }

    getQuestions = (): void => {
        this.adminManagedService.getQuestions().subscribe(
            (response) => {
                response = this.pmvQuestions = response;
                this.showSpinner = true;
            }
            , (error) => {
                this.showSpinner = false;
                console.log(error);
            }
        );

    }


  getMasterAssignment = (): void => {
    let max = 0;
    this.adminManagedService.getMasterAssignment().subscribe(
        (response) => {
         // response = this.masterAssignments = response;
          response=    this.masterAssignments = response.filter(x => x.status == 'F');////FILTER CONDITION
       let minId =   Math.min.apply(Math,this.masterAssignments.map(function(item){return item.id;}));
          this.masterAssignments = response.filter(x => x.id == minId);
          this.masterAssignment  = Object.assign({}, this.masterAssignments[0]);
          this.selectionForm.controls["selectedYear"].setValue(this.masterAssignment.fiscalYear);
          this.selectionForm.controls["selectedQuarter"].setValue(this.masterAssignment.quarter);
          this.showSpinner = true;
        }
        , (error) => {
          this.showSpinner = false;
          console.log(error);
        }
    );

  }


  ngOnInit() {

    /*this.subscription.add(this.adminManagedService.getCompanies().subscribe((response)  => {
          response = this.selectedCompanies = response
      /!*let tempRoles: Company[];
      tempRoles = response;
      tempRoles.forEach(el => {
        this.selectCompanies.push({
          label: el.companyName, value: el.id
        });
      });*!/
    }
        , (error) => {
          console.log(error);
        }
    ));*/

    this.getCompanies();
    this.getMasterAssignment();
    this.getQuestions();

    this.selectionForm =  this.fb.group({
      selectedYear: new FormControl("",Validators.compose([Validators.required])),
      selectedQuarter: new FormControl("",Validators.compose([Validators.required])),
      selectedCompanies: new FormControl("",Validators.compose([Validators.required])),
    });

}

private  save(){
    this.companies =  this.selectionForm.controls["selectedCompanies"].value;///SELECLTE
    let tempRoles: Company[];
    let tempmasterCompanyAssignment: MasterCompanyAssignment[]= [];
    let tempPmvFinancialAssignment:PmvFinancialAssignment[]=[];
    tempRoles = this.companies;
    let tempQuestions = this.pmvQuestions;
    tempRoles.forEach(el => {
        //let bodyselectedYear = JSON.stringify( el);
        //let body = JSON.stringify( this.masterAssignment);
        //console.log("selectCompanies........."+bodyselectedYear);
        //console.log("masterAssignment........."+body);
        tempmasterCompanyAssignment.push({
         id: Math.round(Math.floor(Math.random() * (1000 - 100 + 1)) + 100), masterAssignmentId:this.masterAssignment.id,companyId:el.id,status:'F'

         });
    });
   let tempmaster = JSON.stringify( tempmasterCompanyAssignment);
    console.log("masterCompanyAssignment........."+tempmaster);
////////////////////prepare Questions and ANS////////////////////////////////////////
    tempmasterCompanyAssignment.forEach(cs => {
        tempQuestions.forEach(qa => {
            tempPmvFinancialAssignment.push({
                id: Math.round(Math.floor(Math.random() * (1000 - 100 + 1)) + 100), companyAssignmentId:cs.id,pmvQuestionId:qa.id,answerStatusTypeId:1,answer:null,status:'F'

            });

        });


    });


   let disfinancialAssignment = JSON.stringify( tempPmvFinancialAssignment);
    console.log("PmvFinancialAssignment........."+disfinancialAssignment);


}




  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
