import { Component } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="container mx-auto p-8 h-full">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  constructor(themeService: ThemeService) {
    themeService.load();
  }
}
