import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: `
    <div class="w-16 h-16 relative mb-4" role="img" aria-label="Avatar of blog author">
      <div class="group w-full h-full rounded-full overflow-hidden shadow-inner text-center table">
        <span class="hidden group-hover:table-cell text-white font-bold align-middle">
          KR
        </span>
        <img
          src="https://avatars1.githubusercontent.com/u/25516557?s=460&u=b15a0b6c89d6d8d0b7225a6eab30c060f70d3d9f&v=4"
          alt="avatar"
          class="object-cover object-center w-full h-full visible group-hover:hidden"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {}
