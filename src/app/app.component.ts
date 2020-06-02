import { Component } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="container mx-auto p-4">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  constructor(private readonly themeService: ThemeService) {
    themeService.load();
  }
}
