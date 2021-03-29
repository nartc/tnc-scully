import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Frontmatter } from '../../shared/frontmatter';
import { latestByDate } from '../../shared/utils/operators/latest-by-date.operator';

@Component({
  selector: 'app-blog-list',
  template: `
    <!--    IntersectionObserver needs to be revisit-->
    <!--    <div appIntersectionObserver class="flex flex-col divide-y divide-gray-400">-->
    <!--      <section #sectionElement *ngFor="let link of links$ | async">-->
    <!--        <app-blog-list-item-->
    <!--          *appIntersectionObservee="sectionElement; else skeleton"-->
    <!--          [route]="link"-->
    <!--        ></app-blog-list-item>-->
    <!--        <ng-template #skeleton>-->
    <!--          <div class="py-4 flex flex-col animate-pulse gap-4">-->
    <!--            <div class="flex justify-between">-->
    <!--              <div class="h-4 bg-gray-400 rounded w-1/4"></div>-->
    <!--              <div class="h-4 bg-gray-400 rounded w-1/4"></div>-->
    <!--            </div>-->
    <!--            <div class="h-6 bg-gray-400 rounded w-2/3"></div>-->
    <!--            <div class="h-4 bg-gray-400 rounded"></div>-->
    <!--          </div>-->
    <!--        </ng-template>-->
    <!--      </section>-->
    <!--    </div>-->

    <div class="flex flex-col divide-y divide-gray-400">
      <app-blog-list-item *ngFor="let link of links$ | async" [route]="link"></app-blog-list-item>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListComponent implements OnInit {
  links$: Observable<Frontmatter[]>;

  constructor(private readonly scullyRoutesService: ScullyRoutesService) {}

  ngOnInit(): void {
    this.links$ = this.scullyRoutesService.available$.pipe(
      map((links) => links.filter((l) => l.route.includes('/blog') && l.title != null)),
      latestByDate<Frontmatter[]>(),
    );
  }
}
