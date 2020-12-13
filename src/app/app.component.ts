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
    // router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((ee: NavigationEnd) => {
    //   gtag('config', 'UA-154847070-1', { page_path: ee.urlAfterRedirects });
    // });
  }
}
