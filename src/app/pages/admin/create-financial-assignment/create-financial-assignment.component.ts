import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Subscription } from "rxjs/subscription";
import { forkJoin } from 'rxjs/observable/forkJoin';

import { AdminManagedService } from "../../../theme/services/admin-managedata.service";
import { Company, MasterAssignment, MasterCompanyAssignment, PmvQuestion } from "../../../theme/models";

@Component({
    selector: 'app-create-financial-assignment',
    templateUrl: './create-financial-assignment.component.html',
    styleUrls: ['./create-financial-assignment.component.scss']
})
export class CreateFinancialAssignmentComponent implements OnInit, OnDestroy {
    private subscription = new Subscription();
    companies: Company[];
    pmvQuestions: PmvQuestion[];
    masterCompanyAssignment: MasterCompanyAssignment[];
    selectionForm: FormGroup;
    showSpinner: boolean;
    //selectCompanies: SelectItem[] = [];
    //selectedCompanies: Company[];
    masterAssignments: MasterAssignment[];
    masterAssignment: MasterAssignment = new MasterAssignment();

    constructor(private adminManagedService: AdminManagedService, private fb: FormBuilder) { }

    private equals = (objOne, objTwo): boolean => {
        if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
            return objOne.id === objTwo.id;
        }
    }

    private selectAll = (select: FormControl, values: Company[]): void => {
        select.setValue(values);
    }

    private deselectAll = (select: FormControl): void => {
        select.setValue([]);
    }

    /*     getCompanies = (): void => {
            this.showSpinner = true;
            this.adminManagedService.getCompanies().subscribe(
                (response) => {
                    this.companies = response;
                    this.showSpinner = false;
                }, (error) => {
                    this.showSpinner = false;
                    console.log(error);
                }
            );
        }
    
        getQuestions = (): void => {
            this.showSpinner = true;
            this.adminManagedService.getQuestions().subscribe(
                (response) => {
                    this.pmvQuestions = response;
                    this.showSpinner = false;
                }, (error) => {
                    this.showSpinner = false;
                    console.log(error);
                }
            );
    
        }
    
        getMasterAssignment = (): void => {
            this.showSpinner = true;
            this.adminManagedService.getMasterAssignment().subscribe(
                (response) => {
                    this.masterAssignments = response.filter(x => x.status == 'F');////FILTER CONDITION
                    // let minId = Math.min.apply(Math, this.masterAssignments.map(function (item) { return item.id; }));
                    // this.masterAssignments = response.filter(x => x.id == minId);
                    // this.masterAssignment = Object.assign({}, this.masterAssignments[0]);
                    this.masterAssignment = this.masterAssignments.reduce((prev, curr) => prev.id < curr.id ? prev : curr);
                    this.selectionForm.controls["selectedYear"].setValue(this.masterAssignment.fiscalYear);
                    this.selectionForm.controls["selectedQuarter"].setValue(this.masterAssignment.quarter);
                    this.showSpinner = false;
                }, (error) => {
                    this.showSpinner = false;
                    console.log(error);
                }
            );
        }
     */

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
        this.showSpinner = true;
        this.subscription.add(forkJoin([this.adminManagedService.getCompanies(), this.adminManagedService.getQuestions(), this.adminManagedService.getMasterAssignment()]).subscribe(
            response => {
                this.companies = response[0];
                this.pmvQuestions = response[1];
                this.masterAssignments = response[2].filter(item => item.status = 'F');
                this.masterAssignment = this.masterAssignments.reduce((prev, curr) => prev.id < curr.id ? prev : curr);
                this.selectionForm.controls["selectedYear"].setValue(this.masterAssignment.fiscalYear);
                this.selectionForm.controls["selectedQuarter"].setValue(this.masterAssignment.quarter);
                this.showSpinner = false;
            }, error => {
                console.log("Error retrieving the data", error);
                this.showSpinner = false;
            }
        ));
        /* this.getCompanies();
        this.getMasterAssignment();
        this.getQuestions(); */

        this.selectionForm = this.fb.group({
            selectedYear: ["", [Validators.required]],
            selectedQuarter: ["", [Validators.required]],
            selectedCompanies: ["", [Validators.required]],
        });

    }

    private save = (): void => {
        /* this.companies = this.selectionForm.controls["selectedCompanies"].value;
        let tempRoles: Company[];
        let tempmasterCompanyAssignment: MasterCompanyAssignment[] = [];
        let tempPmvFinancialAssignment: PmvFinancialAssignment[] = [];
        tempRoles = this.companies;
        let tempQuestions = this.pmvQuestions;
        tempRoles.forEach(el => {
            //let bodyselectedYear = JSON.stringify( el);
            //let body = JSON.stringify( this.masterAssignment);
            //console.log("selectCompanies........."+bodyselectedYear);
            //console.log("masterAssignment........."+body);
            tempmasterCompanyAssignment.push({
                id: Math.round(Math.floor(Math.random() * (1000 - 100 + 1)) + 100), masterAssignmentId: this.masterAssignment.id, companyId: el.id, status: 'F'
            });
        }); 
        let tempmaster = JSON.stringify(tempMasterCompanyAssignment);
        console.log("masterCompanyAssignment........." + tempmaster);
        ////////////////////prepare Questions and ANS////////////////////////////////////////
        tempmasterCompanyAssignment.forEach(cs => {
            tempQuestions.forEach(qa => {
                tempPmvFinancialAssignment.push({
                    id: this.generateId(), companyAssignmentId: cs.id, pmvQuestionId: qa.id, answerStatusTypeId: 1, answer: null, status: 'F'
                });
            });
        });
        let disfinancialAssignment = JSON.stringify(tempPmvFinancialAssignment);
        console.log("PmvFinancialAssignment........." + disfinancialAssignment);*/
        let selectedCompanies = this.selectionForm.controls["selectedCompanies"].value;
        let masterCompanyAssignment = selectedCompanies.map((company) => {
            return {
                id: this.generateId(),
                masterAssignmentId: this.masterAssignment.id,
                companyId: company.id,
                status: 'F'
            }
        });
        console.log("masterCompanyAssignment........." + JSON.stringify(masterCompanyAssignment));
        let pmvFinancialAssignment = masterCompanyAssignment.map(cs => {
            return this.pmvQuestions.map(qa => {
                return {
                    id: this.generateId(),
                    companyAssignmentId: cs.id,
                    pmvQuestionId: qa.id,
                    answerStatusTypeId: 1,
                    answer: null,
                    status: 'F'
                }
            })
        })
        console.log("PmvFinancialAssignment........." + JSON.stringify(pmvFinancialAssignment));
    }

    private generateId = (): number => {
        return Math.round(Math.floor(Math.random() * (1000 - 100 + 1)) + 100);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
