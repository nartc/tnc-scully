import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private static readonly lsKey = 'nartc-prefers-scheme';

  private renderer: Renderer2;
  private window: Window;
  private readonly body: HTMLElement;

  private currentScheme: 'dark' | 'light';

  constructor(rendererFactory2: RendererFactory2, @Inject(DOCUMENT) injectedDocument: Document) {
    this.renderer = rendererFactory2.createRenderer(null, null);
    this.window = injectedDocument.defaultView as Window;
    this.body = injectedDocument.body;
  }

  get scheme() {
    return this.currentScheme;
  }

  load() {
    this.getCurrentScheme();
    this.set(this.scheme);
  }

  update() {
    const updateScheme = this.scheme === 'dark' ? 'light' : 'dark';
    this.set(updateScheme);
    localStorage.setItem(ThemeService.lsKey, updateScheme);
    this.currentScheme = updateScheme;
  }

  private set(scheme: 'dark' | 'light') {
    this.renderer.setAttribute(this.body, 'class', `theme-${scheme}`);
  }

  private getCurrentScheme() {
    const scheme = localStorage.getItem(ThemeService.lsKey);
    if (scheme != null) {
      return (this.currentScheme = scheme as 'dark' | 'light');
    }

    if (this.window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
      return (this.currentScheme = this.window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');
    }
    // default to light theme if browser does not support prefers-color-scheme
    return (this.currentScheme = 'light');
  }
}
