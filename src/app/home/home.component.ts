import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MetaService } from '../shared/services/meta.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="grid gap-x-4 grid-cols-1 lg:grid-cols-4">
      <aside class="col-span-4 lg:col-span-1">
        <div class="max-w-full lg:max-w-sm rounded overflow-hidden shadow-common p-4 relative">
          <app-theme-toggler positionClass="absolute top-1 right-1"></app-theme-toggler>
          <app-avatar></app-avatar>
          <app-info></app-info>
          <app-navigation></app-navigation>
          <app-socials></app-socials>
          <app-copyright></app-copyright>
        </div>
      </aside>
      <main class="col-span-4 lg:col-span-3">
        <div class="rounded overflow-hidden shadow-common p-4">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  constructor(private readonly metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.resetMeta();
  }
}
