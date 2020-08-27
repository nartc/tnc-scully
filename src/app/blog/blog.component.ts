import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
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
export class BlogComponent {
  blog$: Observable<Frontmatter> = this.scullyRoutesService.getCurrent().pipe(
    tap((blog: Frontmatter) => {
      this.metaService.update({ ...blog, url: `${ environment.baseUrl }${ blog.route }` });
    }),
  );
  isProd = environment.production;

  constructor(
    private readonly scullyRoutesService: ScullyRoutesService,
    private readonly metaService: MetaService,
  ) {
  }
}
