import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { GroupService, IGroup } from '../group.service';


@Component({
  template: `
  <ng-template #content let-c="close" let-d="dismiss">
    <div class="modal-header">
      <h4 class="modal-title" *ngIf="currentGroup">Edit group</h4>
      <h4 class="modal-title" *ngIf="!currentGroup">Add group</h4>
      <button type="button" class="close" aria-label="Close" (click)="d()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <form (submit)="submitGroup()" [formGroup]="groupForm" novalidate>
      <div class="modal-body">
        <div class="form-group">
          <wi-form-group>
            <label for="name">Name</label>
            <input wiField type="text" class="form-control" placeholder="Group name" formControlName="name" id="name">
            <wi-form-error *ngIf="name.hasError('required')">Name is required.</wi-form-error>
            <wi-form-error *ngIf="name.hasError('existName')">'{{name.errors.existName.value}}' already exists.</wi-form-error>
          </wi-form-group>
        </div>
        <div class="form-group">
          <wi-form-group>
            <label for="abs_path">Absolute path</label>
            <input wiField type="text" class="form-control" placeholder="Absolute path" formControlName="abs_path" id="abs_path">
            <wi-form-error *ngIf="abs_path.hasError('required')">Absolute path is required.</wi-form-error>
          </wi-form-group>
        </div>
        <div class="form-group">
          <wi-form-group>
           <label for="web_path">Web path</label>
           <input wiField type="text" class="form-control" placeholder="Web path" formControlName="web_path" id="web_path">
           <wi-form-error *ngIf="web_path.hasError('required')">Web path is required.</wi-form-error>
          </wi-form-group>
        </div>
        <div class="form-group">
          <wi-form-group>
            <label for="thumbnail_path">Thumbnail path</label>
            <input wiField type="text" class="form-control" placeholder="Thumbnail path" formControlName="thumbnail_path" id="thumbnail_path">
            <wi-form-error *ngIf="thumbnail_path.hasError('required')">Thumbnail path is required.</wi-form-error>
          </wi-form-group>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="c()">Cancel</button>
        <button type="submit" class="btn btn-success">Save</button>
      </div>
    </form>
  </ng-template>
  <br>
  <br>
  <div class="container">
    <div class="text-right">
      <a class="btn btn-primary" href="#" (click)="open(content)">Add a new group</a>
    </div>
    <br>
    <br>
    <ul class="list-group">
      <li class="list-group-item" *ngFor="let group of groups">
        <a href="#" (click)="open(content, group)">{{ group.name }}</a>
      </li>
    </ul>
  </div>
  `
})
export class SettingsComponent implements OnInit {

  groups: IGroup[];
  currentGroup: IGroup;
  groupForm: FormGroup;
  modal: NgbModalRef;

  get name() { return this.groupForm.get('name'); }
  get abs_path() { return this.groupForm.get('abs_path'); }
  get web_path() { return this.groupForm.get('web_path'); }
  get thumbnail_path() { return this.groupForm.get('thumbnail_path'); }

  constructor(private fb: FormBuilder, public modalService: NgbModal, private groupService: GroupService) {}

  existNameValidator(control: AbstractControl): {[key: string]: any} {
    const groups: IGroup[] = this.groups.filter((group: IGroup) => (
      group.name === control.value && (!this.currentGroup || group.id !== this.currentGroup.id)));
    return groups.length ? {'existName': {value: control.value}} : null;
  }

  createForm() {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, this.existNameValidator.bind(this)]],
      abs_path: ['', Validators.required],
      web_path: ['', Validators.required],
      thumbnail_path: ['', Validators.required],
    });

    if (this.currentGroup) {
      this.groupForm.setValue({
        name: this.currentGroup.name,
        abs_path: this.currentGroup.abs_path,
        web_path: this.currentGroup.web_path,
        thumbnail_path: this.currentGroup.thumbnail_path,
      });
    }
  }

  ngOnInit() {
    this.groupService.getGroups().subscribe((groups: IGroup[]) => this.groups = groups);
  }


  open(content: TemplateRef<any>, group: IGroup = null) {
    this.currentGroup = group;
    this.createForm();
    this.modal = this.modalService.open(content);
    return false;
  }

  submitGroup() {
    if (this.groupForm.invalid) {
      return;
    }
   const formModel = this.groupForm.value;
    const group: IGroup = {
      id: this.currentGroup ? this.currentGroup.id : null,
      name: formModel.name,
      abs_path: formModel.abs_path,
      web_path: formModel.web_path,
      thumbnail_path: formModel.thumbnail_path,
    };

    let func: Function;

    if (this.currentGroup) {
      func = this.groupService.updateGroup;
    } else {
      func = this.groupService.createGroup;
    }

    func.call(this.groupService, group).then(() => {
      this.modal.close();
    }).catch((res) => {
      Object.keys(res.errors).map((key) => {
        this.groupForm.get(key).setErrors(res.errors[key]);
      });
    });

    return false;
  }

}
