import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Item, ItemTypes, Question } from './item.model';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.scss']
})
export class AddItemComponent implements OnInit {
  public form: FormGroup;
  public passwordHide: boolean = true;
  public itemType: ItemTypes;
  public item: Item | Question;
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
        initialValue = (<Question>this.item) ? (<Question>this.item).question : null;
        this.form.addControl("question", new FormControl(initialValue, Validators.compose([Validators.required, Validators.minLength(10)])));
        this.form.removeControl("name");
      } else {
        initialValue = (<Item>this.item) ? (<Item>this.item).name : null
        this.form.addControl("name", new FormControl(initialValue, Validators.compose([Validators.required, Validators.minLength(3)])));
        this.form.removeControl("question");
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (!this.item) this.item = {} as Item | Question;

    if (this.itemType == ItemTypes.questions) {
      (<Question>this.item).question = this.form.value ? this.form.value['question'] : '';
    } else {
      (<Item>this.item).name = this.form.value ? this.form.value['name'] : '';
    }
    this.dialogRef.close(this.item);
  }

}
