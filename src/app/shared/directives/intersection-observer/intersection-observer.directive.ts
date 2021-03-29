import { AfterViewInit, Directive, Input } from '@angular/core';

@Directive({
  selector: '[appIntersectionObserver]',
})
export class IntersectionObserverDirective implements AfterViewInit {
  @Input('appIntersectionObserverRootMargin') rootMargin = '0px';
  @Input('appIntersectionObserverThreshold') threshold: number | number[];

  private readonly callbacks = new Map<Element, IntersectionObserverCallback>();
  private observer: IntersectionObserver;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        this.callbacks.forEach((callback, element) => {
          const filtered = entries.filter(({ target, isIntersecting }) => target === element);
          return filtered.length && callback(filtered, observer);
        });
      },
      { rootMargin: this.rootMargin, threshold: 0.5 },
    );
  }

  observe(target: Element, callback: IntersectionObserverCallback = () => {}) {
    console.log('observing', target);
    this.observer?.observe(target);
    this.callbacks.set(target, callback);
  }

  unobserve(target: Element) {
    this.observer?.unobserve(target);
    this.callbacks.delete(target);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.observer = null;
  }
}
