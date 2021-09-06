import {
  AfterViewInit,
  Directive,
  EmbeddedViewRef,
  Input,
  Optional,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { fromEventPattern } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Destroyable } from '../../destroyable';
import { IntersectionObserverDirective } from './intersection-observer.directive';

@Directive({
  selector: '[appIntersectionObservee]',
})
export class IntersectionObserveeDirective extends Destroyable implements AfterViewInit {
  @Input('appIntersectionObservee')
  set element(value: HTMLElement) {
    if (!value) {
      throw new Error('IntersectionObserveeDirective needs a wrapper DOM Element');
    }
    this._element = value;
  }

  private _element: HTMLElement;

  @Input('appIntersectionObserveeDebounce') debounce = 0;

  @Input('appIntersectionObserveeElse') set elseTemplate(templateRef: TemplateRef<unknown>) {
    this._elseTemplateRef = templateRef;
    this._elseViewRef = null;
    this._updateView();
  }

  private readonly _thenTemplateRef: TemplateRef<unknown> | null = null;
  private _thenViewRef: EmbeddedViewRef<unknown> | null = null;
  private _elseTemplateRef: TemplateRef<unknown> | null = null;
  private _elseViewRef: EmbeddedViewRef<unknown> | null = null;

  private isIntersect = false;

  constructor(
    private readonly viewRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<unknown>,
    @Optional() private readonly observer?: IntersectionObserverDirective,
  ) {
    super();
    if (!observer) {
      throw new Error(
        'IntersectionObserveeDirective cannot be used without parent IntersectionObserverDirective',
      );
    }
    this._thenTemplateRef = templateRef;
  }

  ngAfterViewInit() {
    let source$ = fromEventPattern(
      (handler) => {
        this.observer?.observe(this._element, handler);
      },
      () => {
        this.observer?.unobserve(this._element);
      },
    );

    if (this.debounce) {
      source$ = source$.pipe(debounceTime(this.debounce));
    }

    source$
      .pipe(takeUntil(this.$destroyed))
      .subscribe(([entries]: [IntersectionObserverEntry[]]) => {
        const intersectEntry = entries.find((entry) => entry.isIntersecting);
        this.isIntersect = !!intersectEntry;
        this._updateView();
      });
  }

  private _updateView() {
    if (this.isIntersect) {
      if (!this._thenViewRef) {
        this.viewRef.clear();
        this._elseViewRef = null;
        if (this._thenTemplateRef) {
          this._thenViewRef = this.viewRef.createEmbeddedView(this._thenTemplateRef);
          this._thenViewRef.markForCheck();
        }
      }
    } else {
      if (!this._elseViewRef) {
        this.viewRef.clear();
        this._thenViewRef = null;
        if (this._elseTemplateRef) {
          this._elseViewRef = this.viewRef.createEmbeddedView(this._elseTemplateRef);
          this._elseViewRef.markForCheck();
        }
      }
    }
  }
}
