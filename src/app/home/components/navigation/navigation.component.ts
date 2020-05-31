import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-navigation',
  template: `
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  @HostBinding('class') navigationClasses =
    'flex flex-row lg:flex-col items-center lg:items-start mb-4';
}
