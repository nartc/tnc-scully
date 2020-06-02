import { Component } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="container mx-auto p-4">
      <app-theme-toggler></app-theme-toggler>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  constructor(private readonly themeService: ThemeService) {
    themeService.load();
  }
}
