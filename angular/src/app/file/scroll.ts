import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Observable, Subscription } from 'rxjs/Rx';

import { IFile } from './file';


@Directive({
  selector: '[infiniteScroll]',
})
export class InfiniteScrollDirective implements OnDestroy, OnInit {
  private sub: Subscription;

  private scrollYPosition = 0;

  private nbCols = 6;
  private increment: number = 6 * this.nbCols;
  private maxNb = 50 * this.nbCols;
  private initialNb: number = 30 * this.nbCols;
  private startNb = 0;
  private endNb: number = this.initialNb;

  private _nbFiles: number;

  @Output() scrolled = new EventEmitter<{}>();

  @Input('infiniteScroll') nbFiles: number;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    const obs = Observable.fromEvent(window, 'scroll');
    this.sub = obs.subscribe(() => {
      if (! this.nbFiles) { return false; }

      const pos: ClientRect = this.elementRef.nativeElement.getBoundingClientRect();
      if (window.scrollY > this.scrollYPosition) {
        // Scroll down
        if (this.endNb < this.nbFiles && pos['y'] + pos.height < window.innerHeight * 2) {
          this.endNb = Math.min(this.endNb + this.increment, this.nbFiles);
          this.startNb = Math.max(this.endNb - this.maxNb, 0);
          this.scrolled.emit({'start': this.startNb, 'end': this.endNb});
        }
      } else {
        // Scroll up
        if (this.startNb > 0 && Math.abs(pos['y']) < window.innerHeight) {
          this.startNb = Math.max(this.startNb - this.increment, 0);
          this.endNb = Math.min(this.startNb + this.maxNb, this.nbFiles);
          this.scrolled.emit({'start': this.startNb, 'end': this.endNb});
        }
      }

      this.scrollYPosition = window.scrollY;
    });
  }

  ngOnDestroy() {
    if (this.sub) { this.sub.unsubscribe(); }
  }
}
