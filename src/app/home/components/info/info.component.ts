import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-info',
  template: `
    <p class="font-bold mb-4 text-xl">Chau Tran</p>
    <p class="font-hairline text-sm mb-4">
      I am a developer who is highly interested in TypeScript. My tech stack has been full-stack TS
      such as Angular, React with TypeScript and NestJS.
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent {}
