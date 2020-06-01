import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { Observable } from 'rxjs';
import { shareReplay, takeUntil, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Destroyable } from '../shared/destroyable';
import { Frontmatter } from '../shared/frontmatter';
import { MetaService } from '../shared/services/meta.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent extends Destroyable {
  blog$: Observable<Frontmatter> = this.scullyRoutesService.getCurrent().pipe(
    tap((blog: Frontmatter) => {
      this.metaService.update({ ...blog, url: `${environment.baseUrl}/${blog.route}` });
    }),
    shareReplay(1),
    takeUntil(this.$destroyed),
  );

  constructor(
    private readonly scullyRoutesService: ScullyRoutesService,
    private readonly metaService: MetaService,
  ) {
    super();
  }
}
