import { Component, ContentChild, Directive, HostBinding } from '@angular/core';
import { FormGroupDirective, NgControl } from '@angular/forms';

import { Subscription } from 'rxjs/Rx';


@Directive({
  selector: 'wi-form-error',
  host: {
    'class': 'invalid-feedback',
  }
})
export class WIFormErrorDirective {}


@Directive({
  selector: '[wiField]',
  host: {
    '[class.is-invalid]': 'isInvalid()',
    '[class.is-valid]': 'isValid()',
  }
})
export class WIFieldDirective {

  formSubscription: Subscription;
  formSubmitted = false;

  constructor(private parentFormGroup: FormGroupDirective, private control: NgControl) {
    this.formSubscription = this.parentFormGroup.ngSubmit.subscribe(() => this.formSubmitted = true);
  }

  public isInvalid(): boolean {
    if (! this.control.invalid) {
      return false;
    }
    // NOTE: we don't use this.parentFormGroup.submitted since we don't want to
    // have this condition to true when adding some fields on the fly
    return (this.control.dirty || this.formSubmitted);
  }

  public isValid(): boolean {
    return (this.control.valid && this.formSubmitted);
  }
}


@Component({
  selector: 'wi-form-group',
  template: `
  <ng-content></ng-content>
  <ng-content select="wi-form-error" *ngIf="field.isInvalid()"></ng-content>
  `,
})
export class WIFormGroupComponent {

  @ContentChild(WIFieldDirective) field: WIFieldDirective;

}
