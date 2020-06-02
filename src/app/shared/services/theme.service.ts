import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ColorScheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private $colorScheme = new BehaviorSubject<ColorScheme>('light');
  colorScheme$ = this.$colorScheme.asObservable();

  private renderer: Renderer2;

  constructor(private readonly rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  load() {
    this.getColorScheme();
    const scheme = this.$colorScheme.getValue();
    if (scheme === 'dark') {
      this.renderer.removeClass(document.body, 'theme-light');
    }
    this.renderer.addClass(document.body, 'theme-' + scheme);
  }

  update() {
    const current = this.$colorScheme.getValue();
    this.setColorScheme(current === 'dark' ? 'light' : 'dark');
    this.renderer.removeClass(document.body, 'theme-' + current);
    this.renderer.addClass(document.body, 'theme-' + (current === 'dark' ? 'light' : 'dark'));
  }

  private setColorScheme(scheme: ColorScheme) {
    this.$colorScheme.next(scheme);
    localStorage.setItem('prefers-scheme', scheme);
  }

  private getColorScheme() {
    const scheme: ColorScheme = localStorage.getItem('prefers-scheme') as ColorScheme;
    if (scheme != null) {
      this.$colorScheme.next(scheme);
    } else {
      this.detectPreferColorScheme();
    }
  }

  private detectPreferColorScheme() {
    if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
      this.$colorScheme.next(
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      );
    }
    // browser does not support prefers-color-scheme. Keep 'light'
  }
}
