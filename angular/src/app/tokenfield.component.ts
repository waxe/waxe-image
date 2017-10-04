// https://plnkr.co/edit/sZNw1lO2y3ZZR0GxLyjD?p=preview
import {Component, NgModule, ViewChild, Input, Output, HostBinding, EventEmitter, Renderer, forwardRef, ElementRef } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeahead, NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import { TagService } from './tag.service';


enum Key {
  Del = 8,
  Tab = 9,
  Enter = 13,
  Space = 32,
  Comma = 188,
}

const TOKENS_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TokenfieldComponent),
  multi: true
};


function sizeToInt(size: string) {
  return parseInt(size.replace('px', ''), 10);
}


@Component({
  selector: 'tokenfield',
  providers: [TOKENS_VALUE_ACCESSOR, NgbTypeaheadConfig],
  host: {
    '(click)': 'onClick($event)',
  },
  template: `
  <span class="badge badge-secondary" *ngFor="let token of tokens">
    <ng-template [ngIf]="token?.name">
      {{token.name}}
    </ng-template>
    <ng-template [ngIf]="!token?.name">
      {{token}}
    </ng-template>
    <span class="remove-token" (click)="remove(token)">&nbsp;x</span>
  </span>
  <ng-template [ngIf]="items">
    <input #input type="text" [(ngModel)]="inputModel" (keydown)="keyDown($event)" [ngbTypeahead]="searchItems" [resultFormatter]="resultFormatter" (selectItem)="selectItem($event)" placeholder="Add tag" />
  </ng-template>
  <ng-template [ngIf]="!items">
    <input #input type="text" [(ngModel)]="inputModel" (keydown)="keyDown($event)" placeholder="Add tag" />
  </ng-template>
  `,
  styles: [`
    :host {
      height: auto;
      min-height: 42px;
      position: relative;
      display: block;
      width: 100%;
    }

    input {
      border: none;
      outline: 0;
      padding: 0;
      height: 28px;
      line-height: 28px;
      width: 70px;
    }

    .remove-token {
      padding: 3px;
      margin-left: 0.3rem;
    }
    .badge {
      margin-left: 3px;
    }
  `]
})
export class TokenfieldComponent implements ControlValueAccessor {

  @ViewChild('input') input: any;
  @ViewChild(NgbTypeahead) typeahead: NgbTypeahead;

  @Output() changed = new EventEmitter();
  @Input() items: {}[];

  // The ngModel values of this field
  tokens: {}[] = [];

  // The ngModel of the input field
  public inputModel: string = '';

  constructor(private elementRef: ElementRef, private _renderer: Renderer, private tagService: TagService) { }

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.tokens = value;
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  onClick(event: any) {
    // When clicking on the tokenfield gives focus to the input
    if (!event.defaultPrevented) {
      this.input.nativeElement.focus();
    }
  }

  remove(token: {}) {
    // Call when clicking on the cross to remove item
    this.tokens.splice(this.tokens.indexOf(token['value']), 1);
    this.onChange(this.tokens);
    this.input.nativeElement.focus();
  }

  keyDown(event: any) {
    if (event.which === Key.Del && !this.input.nativeElement.value) {
      // Del: remove the last item
      event.preventDefault();
      this.typeahead.dismissPopup();
      this.tokens.pop();
      this.onChange(this.tokens);
      this.resetSize();
      return true;
    }

    if (this.input.nativeElement.value.length === 1) {
      // We are typing the second letter
      // We don't get the first one since it can be an action with typeahead
      this.adjustInputWidth();
    }

    if(this.typeahead && this.typeahead.isPopupOpen()) {
      // Nothing to do: typeahead is opened
      return true;
    }
  }

  resetSize() {
    // TODO: find how to subscribe onChange is this component and attach this
    // function
    this.input.nativeElement.style.width = '70px';  // minimum width
  }

  adjustInputWidth(){
    if (!this.input) return false;

    this.input.nativeElement.style.width = '70px';  // minimum width
    let style = window.getComputedStyle(this.elementRef.nativeElement);

    let width = this.elementRef.nativeElement.offsetWidth - this.input.nativeElement.offsetLeft;

    width -= sizeToInt(style.paddingRight);
    width -= sizeToInt(style.borderRightWidth);

    width -= 2;  // In case of rounded position
    this.input.nativeElement.style.width = width + 'px';
  }

  addCreateNewTag(allItems: any, items: any, term: any) {
    if (allItems.map((item: any) => item['name']).indexOf(term) !== -1) {
      return items;
    }
    items.push({
      'name': `Create new tag: ${term}`,
      'value': term,
      'id': null,
    });
    return items;
  }

  searchItems = (text$: Observable<string>) => {
    return text$
      .debounceTime(200)
      .map(term => {
        return term.length === 0 ? this.items
          : this.addCreateNewTag(this.items, this.items.filter(item => {
            return this.tokens.map(i=> i['id']).indexOf(item['id']) === -1 && new RegExp(term, 'gi').test(item['name']);
          }), term);
      });
  }

  resultFormatter(item: {}) {
    return item['name'];
  }

  selectItem($e: any) {
    $e.preventDefault();
    if ($e.item.id) {
      this.tokens.push($e.item);
      this.onChange(this.tokens);
      this.input.nativeElement.value = '';
      this.input.nativeElement.focus();
      this.resetSize();
    }
    else {
      // TODO: we need to trigger an Event to call the API to create this new
      // tag
      this.tagService.create($e.item.value)
        .then(tag => {
          this.tokens.push(tag)
          this.onChange(this.tokens);
          this.input.nativeElement.value = '';
          this.input.nativeElement.focus();
          this.resetSize();
        });
    }
  }

}
