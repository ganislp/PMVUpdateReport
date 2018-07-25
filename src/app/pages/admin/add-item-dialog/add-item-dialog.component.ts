import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Item, ItemTypes, Question } from './item.model';
import {PmvHeading} from "../../../theme/models/pmv-heading.model";
import {PmvSubHeading} from "../../../theme/models/pmv-subheading.model";
import {PmvQuestion} from "../../../theme/models/pmv-question.model";

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.scss']
})
export class AddItemComponent implements OnInit {
  public form: FormGroup;
  public passwordHide: boolean = true;
  public itemType: ItemTypes;
  public item: Item | PmvQuestion |PmvHeading | PmvSubHeading;
  constructor(public dialogRef: MatDialogRef<AddItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder) {
    this.form = this.fb.group({
      /*  name: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
       question: [null, Validators.compose([Validators.required, Validators.minLength(3)])] */
    });
  }

  ngOnInit() {

    if (this.data) {
      this.itemType = this.data.itemType;
      this.item = this.data.item;
      let initialValue: string;
      if (this.itemType == ItemTypes.questions) {
        initialValue = (<PmvQuestion>this.item) ? (<PmvQuestion>this.item).question : null;
        this.form.addControl("question", new FormControl(initialValue, Validators.compose([Validators.required, Validators.minLength(10)])));
        this.form.removeControl("subHeading");
        this.form.removeControl("heading");
      }

      else if(this.itemType == ItemTypes.headings){

        initialValue = (<PmvHeading>this.item) ? (<PmvHeading>this.item).heading : null;
        this.form.addControl("heading", new FormControl(initialValue, Validators.compose([Validators.required, Validators.minLength(10)])));
        this.form.removeControl("question");
        this.form.removeControl("subHeading");

      }

      else if(this.itemType == ItemTypes.subheadings){

        initialValue = (<PmvSubHeading>this.item) ? (<PmvSubHeading>this.item).subHeading : null;
        this.form.addControl("subHeading", new FormControl(initialValue, Validators.compose([Validators.required, Validators.minLength(10)])));
        this.form.removeControl("question");
        this.form.removeControl("heading");

      }

  /* if (this.itemType == ItemTypes.headings) {
        initialValue = (<PmvHeading>this.item) ? (<PmvHeading>this.item).heading : null;
        this.form.addControl("heading", new FormControl(initialValue, Validators.compose([Validators.required, Validators.minLength(10)])));
        this.form.removeControl("name");
      }*/

     /* else if (this.itemType == ItemTypes.subheadings) {
        initialValue = (<PmvSubHeading>this.item) ? (<PmvSubHeading>this.item).subHeading : null;
        this.form.addControl("subHeading", new FormControl(initialValue, Validators.compose([Validators.required, Validators.minLength(10)])));
        this.form.removeControl("name");
      }


      else {
        initialValue = (<Item>this.item) ? (<Item>this.item).name : null
        this.form.addControl("name", new FormControl(initialValue, Validators.compose([Validators.required, Validators.minLength(3)])));
        this.form.removeControl("question");
      }*/
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (!this.item) this.item = {} as Item | PmvQuestion |PmvHeading | PmvSubHeading;

    if (this.itemType == ItemTypes.questions) {
      (<PmvQuestion>this.item).question = this.form.value ? this.form.value['question'] : '';
    }
    else if(this.itemType == ItemTypes.headings){
      (<PmvHeading>this.item).heading = this.form.value ? this.form.value['heading'] : '';

    }
    else if(this.itemType == ItemTypes.subheadings){
      (<PmvSubHeading>this.item).subHeading = this.form.value ? this.form.value['subHeading'] : '';
    }
    this.dialogRef.close(this.item);
  }

}
