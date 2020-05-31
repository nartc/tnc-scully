import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container mx-auto p-4">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
}
