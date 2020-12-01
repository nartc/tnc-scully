import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MetaService } from '../shared/services/meta.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  constructor(private readonly metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.resetMeta();
  }
}
