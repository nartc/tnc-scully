import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MetaService } from '../shared/services/meta.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(readonly metaService: MetaService) {
    metaService.resetMeta();
  }
}
