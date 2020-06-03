import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Destroyable } from '../../shared/destroyable';
import { Frontmatter } from '../../shared/frontmatter';
import { latestByDate } from '../../shared/utils/operators/latest-by-date.operator';

@Component({
  selector: 'app-blog-list',
  template: `
    <div class="flex flex-col divide-y divide-gray-400">
      <app-blog-list-item *ngFor="let link of links$ | async" [route]="link"></app-blog-list-item>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListComponent extends Destroyable implements OnInit {
  links$: Observable<Frontmatter[]>;

  constructor(private readonly scullyRoutesService: ScullyRoutesService) {
    super();
  }

  ngOnInit(): void {
    this.links$ = this.scullyRoutesService.available$.pipe(
      map((links) => links.filter((l) => l.route.includes('/blog') && l.title != null)),
      latestByDate<Frontmatter[]>(),
      takeUntil(this.$destroyed),
    );
  }
}
