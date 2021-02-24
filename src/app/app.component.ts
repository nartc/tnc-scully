import { Component } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="container mx-auto p-8">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  constructor(readonly themeService: ThemeService) {
    themeService.load();
  }
}
