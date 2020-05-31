import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ScullyRoute } from '@scullyio/ng-lib';

@Component({
  selector: 'app-blog-list-item',
  template: `
    <div class="flex justify-between items-center">
      <span class="font-light text-gray-600">{{ route.date | date: 'mediumDate' }}</span>
      <a
        class="px-2 py-1 text-sm text-secondary font-bold rounded hover:text-white hover:bg-secondary transition-colors duration-200 ease-in-out"
      >
        {{ route.tags[0] }}
      </a>
    </div>
    <div class="mt-2">
      <a
        class="text-2xl font-bold hover:text-gray-600 transition-colors duration-200 ease-in-out"
        [routerLink]="[route.route]"
      >
        {{ route.title }}
      </a>
      <p class="mt-2 font-thin text-gray-700">
        {{ route.description }}
      </p>
    </div>
    <div class="flex justify-between items-center mt-4">
      <a class="text-primary hover:underline" [routerLink]="[route.route]">Read more</a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogListItemComponent {
  @Input() route: ScullyRoute;
  @HostBinding('class.py-4') padding = true;
}
