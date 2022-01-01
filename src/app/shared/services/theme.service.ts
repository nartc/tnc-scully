import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private static readonly lsKey = 'nartc-prefers-scheme';

  private renderer: Renderer2;
  private window: Window;
  private readonly body: HTMLElement;

  private currentScheme = new BehaviorSubject<'dark' | 'light' | 'twilight'>('light');
  readonly currentScheme$ = this.currentScheme.asObservable();

  constructor(rendererFactory2: RendererFactory2, @Inject(DOCUMENT) injectedDocument: Document) {
    this.renderer = rendererFactory2.createRenderer(null, null);
    this.window = injectedDocument.defaultView as Window;
    this.body = injectedDocument.body;

    this.currentScheme$.subscribe((scheme) => {
      localStorage.setItem(ThemeService.lsKey, scheme);
      this.renderer.setAttribute(this.body, 'class', `theme-${scheme}`);
    });
  }

  get scheme() {
    return this.currentScheme.getValue();
  }

  load() {
    const scheme = localStorage.getItem(ThemeService.lsKey);
    if (scheme != null) {
      return this.set(scheme as 'dark' | 'light' | 'twilight');
    }

    if (this.window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
      return this.set(
        this.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      );
    }

    // default to light theme if browser does not support prefers-color-scheme
    return this.set('light');
  }

  set(scheme: 'dark' | 'light' | 'twilight') {
    this.currentScheme.next(scheme);
  }

  toggle() {
    const updateScheme = this.scheme === 'dark' ? 'light' : 'dark';
    this.set(updateScheme);
  }
}
