import { Component, ContentChild, Directive } from '@angular/core';
import { FormGroupDirective, NgControl } from '@angular/forms';


@Directive({
  selector: 'wi-form-error',
  host: {
    '[class.invalid]': 'true',
  }
})
export class WIFormErrorDirective {}


@Component({
  selector: 'wi-form-group',
  template: `
  <ng-content></ng-content>
  <ng-content select="wi-form-error" *ngIf="hasError()"></ng-content>
  `
})
export class WIFormGroupComponent {

  private formSubmitted = false;

  @ContentChild(NgControl) control: NgControl;

  constructor(private parentFormGroup: FormGroupDirective) {
    this.parentFormGroup.ngSubmit.subscribe(() => this.formSubmitted = true);
  }

  public hasError() {
    if (! this.control.invalid) {
      return false;
    }
    // NOTE: we don't use this.parentFormGroup.submitted since we don't want to
    // have this condition to true when adding some fields on the fly
    return (this.control.dirty || this.formSubmitted);
  }

}
