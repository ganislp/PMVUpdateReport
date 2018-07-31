import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Subscription } from "rxjs/subscription";
import { forkJoin } from 'rxjs/observable/forkJoin';

import { AdminManagedService } from "../../../theme/services/admin-managedata.service";
import { Company, MasterAssignment, MasterCompanyAssignment, PmvQuestion } from "../../../theme/models";
import {Response} from "../../../theme/models/response.model";
import {PmvFinancialAssignment} from "../../../theme/models/pmv-financial-assignment.model";
import {MatTableDataSource, MatPaginator, MatSort} from "@angular/material";

@Component({
    selector: 'app-create-financial-assignment',
    templateUrl: './create-financial-assignment.component.html',
    styleUrls: ['./create-financial-assignment.component.scss']
})
export class CreateFinancialAssignmentComponent implements OnInit, OnDestroy {
    private subscription = new Subscription();
    companies: Company[];
    pmvQuestions: PmvQuestion[];
    pmvFinancialAssignment:PmvFinancialAssignment[];
    masterCompanyAssignments: MasterCompanyAssignment[];
    selectionForm: FormGroup;
    showSpinner: boolean;
    masterAssignments: MasterAssignment[];
    masterAssignment: MasterAssignment = new MasterAssignment();
    masterCompanyAssignmentDisplayedColumns: string[] = ['id','companyName','companyType','completed','review','approved'];
    masterAssignmentDisplayedColumns: string[] = ['id','fiscalYear','quarter','statusTypeId'];
    masterCompanyAssignmentDataSource: MatTableDataSource<MasterCompanyAssignment>;
    masterAssignmentDataSource: MatTableDataSource<MasterAssignment>;
    @ViewChild('masterCompanyAssignmentPaginator') masterCompanyAssignmentPaginator: MatPaginator;
    @ViewChild('masterCompanyAssignmentSort') masterCompanyAssignmentSort: MatSort;
    @ViewChild('masterAssignmentPaginator') masterAssignmentPaginator: MatPaginator;
    @ViewChild('masterAssignmentSort') masterAssignmentSort: MatSort;
    constructor(private adminManagedService: AdminManagedService, private fb: FormBuilder) { }


    applyFilterMasterCompanyAssignment(filterValue: string) {
        this.masterCompanyAssignmentDataSource.filter = filterValue.trim().toLowerCase();
    }

    applyFilterMasterAssignment(filterValue: string) {
        this.masterAssignmentDataSource.filter = filterValue.trim().toLowerCase();
    }

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

    getPmvFinancialAssignment = (): void => {
        this.adminManagedService.getPmvFinancialAssignment().subscribe(
            (response) => {
                response = this.pmvFinancialAssignment = response;
            }
            , (error) => {
                this.showSpinner = false;
                console.log(error);
            }
        );

    }

    getMasterCompanyAssignment = (): void => {
        this.adminManagedService.getMasterCompanyAssignment().subscribe(
            (response) => {
                response = this.masterCompanyAssignments = response;
                let body = JSON.stringify(this.masterCompanyAssignments);
                console.log("body.........."+ body)
                this.masterCompanyAssignmentDataSource = new MatTableDataSource<MasterCompanyAssignment>(this.masterCompanyAssignments);
                this.masterCompanyAssignmentDataSource.paginator = this.masterCompanyAssignmentPaginator;
                this.masterCompanyAssignmentDataSource.sort = this.masterCompanyAssignmentSort;
            }
            , (error) => {
                this.showSpinner = false;
                console.log(error);
            }
        );

    }

    getTypeDescription = (id: number): string =>{
        return this.masterCompanyAssignments.find( item => item.companyId == id) ? this.companies.find( item => item.id == id).companyName : '';
    }

    getCompanyTypeDescription = (id: number): string =>{
        return this.masterCompanyAssignments.find( item => item.companyId == id) ? this.companies.find( item => item.id == id).companyType : '';
    }

    getMasterCompanyAssignmentsProgress():number{
        let totalCompanies = this.masterCompanyAssignments.length;
        let totalCompaniesCompleted = this.masterCompanyAssignments.filter((item => item.statusTypeId == 3)).length;
        let percentageCompleted = totalCompaniesCompleted / totalCompanies * 100;
     return Math.round(percentageCompleted);
    }

    getPmvFinancialAssignmentIncomplete(id:number):number{
        let totalQuestions = this.pmvQuestions.length;
        let totalCompaniesCompleted = this.pmvFinancialAssignment.filter((item => item.companyAssignmentId == id && item.answerStatusTypeId == 1)).length;
        let percentageCompleted = totalCompaniesCompleted / totalQuestions * 100;
        return Math.round(percentageCompleted);
    }

    getPmvFinancialAssignmentCompleted(id:number):number{
        let totalQuestions = this.pmvQuestions.length;
        let totalCompaniesCompleted = this.pmvFinancialAssignment.filter((item => item.companyAssignmentId == id && item.answerStatusTypeId == 2)).length;
        let percentageCompleted = totalCompaniesCompleted / totalQuestions * 100;
        return Math.round(percentageCompleted);
    }

    getPmvFinancialAssignmentReview(id:number):number{
        let totalQuestions = this.pmvQuestions.length;
        let totalCompaniesCompleted = this.pmvFinancialAssignment.filter((item => item.companyAssignmentId == id && item.answerStatusTypeId == 3)).length;
        let percentageCompleted = totalCompaniesCompleted / totalQuestions * 100;
        return Math.round(percentageCompleted);
    }

    getPmvFinancialAssignmentApproved(id:number):number{
        let totalQuestions = this.pmvQuestions.length;
        let totalCompaniesCompleted = this.pmvFinancialAssignment.filter((item => item.companyAssignmentId == id && item.answerStatusTypeId == 4)).length;
        let percentageCompleted = totalCompaniesCompleted / totalQuestions * 100;
        return Math.round(percentageCompleted);
    }

    getPmvFinancialAssignmentRejected(id:number):number{
        let totalQuestions = this.pmvQuestions.length;
        let totalCompaniesCompleted = this.pmvFinancialAssignment.filter((item => item.companyAssignmentId == id && item.answerStatusTypeId == 5)).length;
        let percentageCompleted = totalCompaniesCompleted / totalQuestions * 100;
        return Math.round(percentageCompleted);
    }


    ngOnInit() {

            this.showSpinner = true;
        this.subscription.add(forkJoin([this.adminManagedService.getCompanies(), this.adminManagedService.getQuestions(), this.adminManagedService.getMasterAssignment()]).subscribe(
            response => {
                this.companies = response[0];
                this.pmvQuestions = response[1];
                ///find any InProgress in masterAssignments
              if(response[2].filter((item => item.statusTypeId == 2)).length == 0){
                  this.masterAssignments = response[2].filter(item => item.statusTypeId == 1);
                  this.masterAssignment = this.masterAssignments.reduce((prev, curr) => prev.id < curr.id ? prev : curr);
              }
               else{
                  this.masterAssignments = response[2].filter(item => item.statusTypeId == 2);
                  this.masterAssignment = this.masterAssignments[0];
              }
                this.masterAssignmentDataSource = new MatTableDataSource<MasterAssignment>(this.masterAssignments);
                this.masterAssignmentDataSource.paginator = this.masterAssignmentPaginator;
                this.masterAssignmentDataSource.sort = this.masterAssignmentSort;
                 this.selectionForm.controls["selectedYear"].setValue(this.masterAssignment.fiscalYear);
                this.selectionForm.controls["selectedQuarter"].setValue(this.masterAssignment.quarter);

                this.showSpinner = false;
            }, error => {
                console.log("Error retrieving the data", error);
                this.showSpinner = false;
            }
        ));

        this.selectionForm = this.fb.group({
            selectedYear: ["", [Validators.required]],
            selectedQuarter: ["", [Validators.required]],
            selectedCompanies: ["", [Validators.required]],
        });
        this.getMasterCompanyAssignment();
        this.getPmvFinancialAssignment();

    }

    public createMasterCompanyAssignment(masterCompanyAssignment: MasterCompanyAssignment) {
        this.adminManagedService.createMasterCompanyAssignment(masterCompanyAssignment).subscribe(
            updateUserResponse => {
                // this.getUsers()
                //this.notificationsService.notify('info', '', updateUserResponse.message);
            },
            (errorResponse: Response) => {
                console.log(errorResponse);
                //this.notificationsService.notify('error', '', errorResponse.error.toString());

            });


    }

    public createPmvFinancialAssignment(pmvFinancialAssignment: PmvFinancialAssignment) {
        this.adminManagedService.createPmvFinancialAssignment(pmvFinancialAssignment).subscribe(
            updateUserResponse => {
                // this.getUsers()
                //this.notificationsService.notify('info', '', updateUserResponse.message);
            },
            (errorResponse: Response) => {
                console.log(errorResponse);
                //this.notificationsService.notify('error', '', errorResponse.error.toString());

            });


    }

    public updateMasterAssignmentStatus(masterAssignment: MasterAssignment) {
        this.adminManagedService.updateMasterAssignmentStatus(masterAssignment).subscribe(
            updateUserResponse => {
                // this.getUsers()
                //this.notificationsService.notify('info', '', updateUserResponse.message);
            },
            (errorResponse: Response) => {
                console.log(errorResponse);
                //this.notificationsService.notify('error', '', errorResponse.error.toString());

            });


    }

    private save = (): void => {
        let selectedCompanies = this.selectionForm.controls["selectedCompanies"].value;
        let masterCompanyAssignment = selectedCompanies.map((company) => {
            return {
                id: this.generateId(),
                masterAssignmentId: this.masterAssignment.id,
                companyId: company.id,
                statusTypeId: 2
            }
        });
       // console.log("masterCompanyAssignment........." + JSON.stringify(masterCompanyAssignment));
        let pmvFinancialAssignment = masterCompanyAssignment.map(cs => {
            return this.pmvQuestions.map(qa => {
                return {
                    id: this.generateId(),
                    companyAssignmentId: cs.id,
                    pmvQuestionId: qa.id,
                    answerStatusTypeId: 1,
                    answer: null
                }
            })
        })

       // console.log("PmvFinancialAssignment........." + JSON.stringify(pmvFinancialAssignment));

        ////updateMasterAssignmentStatus------------------------------------
 this.masterAssignment.statusTypeId = 2;

        this.createMasterCompanyAssignment(masterCompanyAssignment);
        this.createPmvFinancialAssignment(pmvFinancialAssignment);
        this.updateMasterAssignmentStatus( this.masterAssignment);
    }

    private generateId = (): number => {
        return Math.round(Math.floor(Math.random() * (1000 - 100 + 1)) + 100);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
