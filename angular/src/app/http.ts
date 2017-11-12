import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Rx';

import { Message, MessageService } from './message';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .do(event => {},
          event => {
            if (event instanceof HttpErrorResponse && event.status === 500) {
              this.messageService.addMessage({'text': 'Something went wrong please reload the page and try again!'} as Message);
            }
      });
  }
}
