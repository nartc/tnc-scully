import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { Observable, ReplaySubject } from 'rxjs';
import { debounceTime, map, scan, startWith } from 'rxjs/operators';
import { BlogListItemModule } from '../shared/components/blog-list-item.component';
import { Frontmatter } from '../shared/frontmatter';
import { latestByDate } from '../shared/utils/operators/latest-by-date.operator';

@Component({
  selector: 'app-blog-list',
  template: `
    <ng-container *ngIf="intersectMap$ | async as intersectMap">
      <div waIntersectionObserver class="flex flex-col divide-y divide-gray-400">
        <section
          *ngFor="let link of links$ | async"
          (waIntersectionObservee)="$intersectionLink.next({ entries: $event, link: link })"
        >
          <app-blog-list-item
            *ngIf="intersectMap[link.slug]; else skeleton"
            [route]="link"
          ></app-blog-list-item>
          <ng-template #skeleton>
            <div class="py-4 flex flex-col animate-pulse gap-4">
              <div class="flex justify-between">
                <div class="h-4 bg-gray-400 rounded w-1/4"></div>
                <div class="h-4 bg-gray-400 rounded w-1/4"></div>
              </div>
              <div class="h-6 bg-gray-400 rounded w-2/3"></div>
              <div class="h-4 bg-gray-400 rounded"></div>
            </div>
          </ng-template>
        </section>
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListComponent {
  readonly links$: Observable<Frontmatter[]> = this.scullyRoutesService.available$.pipe(
    map((links) => links.filter((l) => l.route.includes('/blog') && l.title != null)),
    latestByDate<Frontmatter[]>(),
  );

  readonly $intersectionLink = new ReplaySubject<{
    entries: IntersectionObserverEntry[];
    link: Frontmatter;
  }>(1);

  readonly intersectMap$: Observable<Record<string, boolean>> = this.$intersectionLink.pipe(
    scan((intersectMap, { entries, link }) => {
      const isIntersecting = entries.some((entry) => entry.isIntersecting);
      if (isIntersecting && !intersectMap[link.slug]) {
        intersectMap = { ...intersectMap, [link.slug]: true };
      }
      return intersectMap;
    }, {} as Record<string, boolean>),
    debounceTime(500),
    startWith({}),
  );

  constructor(private scullyRoutesService: ScullyRoutesService) {}
}

@NgModule({
  declarations: [BlogListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: BlogListComponent }]),
    BlogListItemModule,
    IntersectionObserverModule,
  ],
})
export class BlogListModule {}
