import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-socials',
  template: `
    <app-social-icon
      *ngFor="let social of socials"
      [socialId]="social.id"
      [link]="social.link"
    ></app-social-icon>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialsComponent {
  socials = [
    { id: 'Github', link: 'https://github.com/nartc' },
    { id: 'LinkedIn', link: 'https://www.linkedin.com/in/chauntran/' },
    { id: 'Twitter', link: 'https://twitter.com/Nartc1410' },
    { id: 'Facebook', link: 'https://www.facebook.com/ctran2428' },
  ];
  @HostBinding('class')
  socialsClasses = `w-1/2 grid grid-cols-${this.socials.length} lg:grid-cols-3 gap-2 mb-4`;
}
