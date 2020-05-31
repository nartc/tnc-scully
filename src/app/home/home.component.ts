import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  template: `
    <div class="grid col-gap-4 grid-cols-1 lg:grid-cols-4">
      <div class="col-span-4 lg:col-span-1">
        <div class="max-w-full lg:max-w-sm rounded overflow-hidden shadow-lg p-4">
          <app-avatar></app-avatar>
          <app-info></app-info>
          <app-navigation></app-navigation>
          <app-socials></app-socials>
          <p class="text-gray-400 font-thin text-sm">© All rights reserved.</p>
        </div>
      </div>
      <div class="col-span-4 lg:col-span-3">
        <div class="rounded overflow-hidden shadow-lg p-4 flex flex-col divide-y divide-gray-400">
          <app-blog-list-item
            *ngFor="let link of links$ | async"
            [route]="link"
          ></app-blog-list-item>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  links$: Observable<ScullyRoute[]>;

  constructor(private readonly scullyRoutesService: ScullyRoutesService) {}

  ngOnInit(): void {
    this.links$ = this.scullyRoutesService.available$.pipe(
      map((links) => links.filter((l) => l.route !== '/' || l.title != null)),
      tap((links) => {
        console.log(links);
      }),
    );
  }
}
