import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div
      class="absolute top-0 left-0 overflow-hidden h-screen w-screen flex justify-center content-center flex-wrap"
    >
      <p class="text-primary text-6xl">404</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
