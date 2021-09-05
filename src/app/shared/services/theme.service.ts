import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentScheme: 'dark' | 'light';
  private readonly renderer: Renderer2;

  constructor(readonly rendererFactory2: RendererFactory2) {
    this.renderer = rendererFactory2.createRenderer(null, null);
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
    localStorage.setItem('prefers-scheme', updateScheme);
    this.currentScheme = updateScheme;
  }

  private set(scheme: 'dark' | 'light') {
    this.renderer.setAttribute(document.body, 'class', `theme-${scheme}`);
  }

  private getCurrentScheme() {
    const scheme = localStorage.getItem('prefers-scheme');
    if (scheme != null) {
      return (this.currentScheme = scheme as 'dark' | 'light');
    }

    if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
      return (this.currentScheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');
    }
    // default to light theme if browser does not support prefers-color-scheme
    return (this.currentScheme = 'light');
  }
}
