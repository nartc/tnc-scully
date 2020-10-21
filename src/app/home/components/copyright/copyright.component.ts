import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-copyright',
  template: `
    <p class="text-gray-light font-thin text-sm">© All rights reserved.</p>
    <p class="text-gray-light font-thin text-sm ml-1 mt-0 lg:mt-2 lg:ml-0">
      Built with
      <a
        href="https://angular.io"
        rel="noreferrer"
        target="_blank"
        class="cursor-pointer text-primary hover:underline"
      >
        Angular
      </a>
      and
      <a
        href="https://scully.io"
        rel="noreferrer"
        target="_blank"
        class="cursor-pointer text-primary hover:underline"
      >
        Scully
      </a>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-row lg:flex-col',
  },
})
export class CopyrightComponent {}
