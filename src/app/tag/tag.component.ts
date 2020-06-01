import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { of } from 'rxjs';
import { map, pluck, switchMap, takeUntil } from 'rxjs/operators';
import { Destroyable } from '../shared/destroyable';
import { Frontmatter } from '../shared/frontmatter';
import { MetaService } from '../shared/services/meta.service';

@Component({
  selector: 'app-tag',
  template: `
    <app-all-blogs-btn></app-all-blogs-btn>
    <div class="rounded overflow-hidden shadow-lg p-4 flex flex-col divide-y divide-gray-400">
      <ng-container *ngIf="taggedBlogs$ | async as taggedBlogs">
        <ng-container *ngIf="!taggedBlogs.length; else list">
          No blogs to display
        </ng-container>
        <ng-template #list>
          <app-blog-list *ngFor="let link of taggedBlogs" [route]="link"></app-blog-list>
        </ng-template>
      </ng-container>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent extends Destroyable {
  taggedBlogs$ = this.route.params.pipe(
    pluck('tagName'),
    switchMap((tagName: string) => {
      if (!tagName) return of([]);
      this.metaService.updateTagTitle(tagName);
      return this.scullyRoutesService.available$.pipe(
        map<Frontmatter[], Frontmatter[]>((routes) =>
          routes.filter(
            (route) =>
              route.tags?.[0] != null && route.tags[0].toLowerCase() === tagName.toLowerCase(),
          ),
        ),
      );
    }),
    takeUntil(this.$destroyed),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly scullyRoutesService: ScullyRoutesService,
    private readonly metaService: MetaService,
  ) {
    super();
  }
}
