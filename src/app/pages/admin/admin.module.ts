import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AdminComponent } from './admin.component';
import { SharedModule } from '../../shared/shared.module'
import { ApiService } from '../../theme/services';
import { AddItemComponent } from './add-item-dialog/add-item-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AdminManagedService} from "../../theme/services/admin-managedata.service";

const routes: Route[] = [
  { path: '', component: AdminComponent, pathMatch: 'full' }
]

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  declarations: [
    AdminComponent,
    AddItemComponent
  ],
  providers: [ApiService,AdminManagedService],
  entryComponents: [AddItemComponent]
})
export class AdminModule { }
