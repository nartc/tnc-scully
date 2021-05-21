import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-navigation',
  template: `
    <nav class="flex flex-row lg:flex-col items-center lg:items-start mb-4">
      <a
        class="mb-0 lg:mb-2 transition-colors duration-200 ease-in-out hover:underline hover:text-primary cursor-pointer"
        [routerLink]="['/']"
        routerLinkActive="text-primary underline"
        [routerLinkActiveOptions]="{ exact: true }"
      >
        Blogs
      </a>
      <a
        class="mb-0 ml-2 lg:mb-2 lg:ml-0 transition-colors duration-200 ease-in-out hover:underline hover:text-primary cursor-pointer"
        [routerLink]="['/about']"
        routerLinkActive="text-primary underline"
        [routerLinkActiveOptions]="{ exact: true }"
      >
        About Me
      </a>
      <a
        class="mb-0 ml-2 lg:mb-2 lg:ml-0 transition-colors duration-200 ease-in-out hover:underline hover:text-primary cursor-pointer"
        href="https://hackmd.io/@0sCkvgiFQNm2fLdxLu5M8g/bio"
        target="_blank"
        rel="noopener"
      >
        Bio
      </a>
      <a
        *ngIf="isProd"
        class="mb-0 ml-2 lg:mb-2 lg:ml-0 transition-colors duration-200 ease-in-out hover:underline hover:text-primary cursor-pointer"
        href="https://nartc.me/feed.xml"
        target="_blank"
        rel="noopener"
      >
        RSS Feed
      </a>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  isProd = environment.production;
}
