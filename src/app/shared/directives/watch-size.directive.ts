import { Directive, Input, Output, EventEmitter, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appWatchSize]'
})
export class WatchSizeDirective implements OnInit, OnDestroy, AfterViewInit {

  @Input("watch-interval")
  watchInterval = 100;

  @Output()
  widthChange = new EventEmitter<number>();

  @Output()
  heightChange = new EventEmitter<number>();

  private width = 0;
  private height = 0;
  private interval: any;

  constructor(
    private el: ElementRef<HTMLElement>,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.watchSize();
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private getWidth() {
    return this.el.nativeElement.clientWidth;
  }

  private getHeight() {
    return this.el.nativeElement.clientHeight;
  }

  private watchSize() {
    this.interval = setInterval(() => {
      const width = this.getWidth();
      const height = this.getHeight();
      if (this.width != width) {
        this.width = width;
        this.widthChange.emit(this.width);
      }
      if (this.height != height) {
        this.height = height;
        this.heightChange.emit(this.height);
      }
    }, this.watchInterval);
  }

}
