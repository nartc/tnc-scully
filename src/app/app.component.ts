import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  constructor(readonly themeService: ThemeService, readonly router: Router) {
    themeService.load();
    router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((ee: NavigationEnd) => {
      gtag('config', 'UA-154847070-1', { page_path: ee.urlAfterRedirects });
    });
  }
}
