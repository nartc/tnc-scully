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
    this.add(this.scheme);
    this.remove(this.scheme === 'dark' ? 'light' : 'dark');
  }

  update() {
    const updateScheme = this.scheme === 'dark' ? 'light' : 'dark';
    this.remove(this.scheme);
    this.add(updateScheme);
    localStorage.setItem('prefers-scheme', updateScheme);
    this.currentScheme = updateScheme;
  }

  private remove(scheme: 'dark' | 'light') {
    this.renderer.removeClass(document.body, `theme-${scheme}`);
  }

  private add(scheme: 'dark' | 'light') {
    this.renderer.addClass(document.body, `theme-${scheme}`);
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
