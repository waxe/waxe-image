import { Component, Injectable, OnInit, OnDestroy } from '@angular/core';

import { Observable, ReplaySubject, Subscription } from 'rxjs/Rx';


export interface Message {
  text: string;
}


@Injectable()
export class MessageService {

  private _message: ReplaySubject<Message> = new ReplaySubject(1);
  public message: Observable<Message> = this._message.asObservable();


  addMessage(message: Message) {
    this._message.next(message);
  }

}


@Component({
  selector: 'message',
  template: `
    <div class="alert alert-danger text-center" role="alert" *ngIf="message">
      {{message.text}}
    </div>
  `,
})
export class MessageComponent implements OnInit {

  message: Message;
  sub: Subscription;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.sub = this.messageService.message.subscribe((message: Message) => {
      this.message = message;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
