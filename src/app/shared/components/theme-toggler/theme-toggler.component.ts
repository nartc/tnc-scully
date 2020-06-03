import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-theme-toggler',
  template: `
    <svg
      class="w-full h-full"
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 20 20"
      enable-background="new 0 0 20 20"
      xml:space="preserve"
    ></svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeTogglerComponent {
  @Input() positionClass: string;

  @HostBinding('id') togglerId = 'themeToggler';

  @HostBinding('class') get themeTogglerClasses() {
    return (
      'w-10 h-10 lg:flex lg:items-center lg:justify-center cursor-pointer' +
      ' ' +
      this.positionClass
    );
  }

  @HostBinding('attr.aria-label') ariaLabel = 'Dark and Light mode toggle button';
}
