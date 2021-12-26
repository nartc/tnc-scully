import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Inject, Input } from '@angular/core';

@Directive({
  selector: '[appGiscus]',
})
export class GiscusDirective implements AfterViewInit {
  @Input() appGiscus = false;

  constructor(@Inject(DOCUMENT) private document: Document, private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    if (this.appGiscus) {
      try {
        const scriptEl = this.document.createElement('script');
        scriptEl.async = true;
        scriptEl.src = 'https://giscus.app/client.js';
        scriptEl.setAttribute('data-repo', 'nartc/tnc-scully');
        scriptEl.setAttribute('data-repo-id', 'MDEwOlJlcG9zaXRvcnkyNjgzNzE2Mjc=');
        scriptEl.setAttribute('data-category', 'Announcements');
        scriptEl.setAttribute('data-category-id', 'DIC_kwDOD_8Gq84CAbUC');
        scriptEl.setAttribute('data-mapping', 'pathname');
        scriptEl.setAttribute('data-reactions-enabled', '1');
        scriptEl.setAttribute('data-emit-metadata', '0');
        scriptEl.setAttribute('data-theme', 'preferred_color_scheme');
        scriptEl.setAttribute('data-lang', 'en');
        scriptEl.setAttribute('crossorigin', 'anonymous');
        this.el.nativeElement.appendChild(scriptEl);
      } catch (e) {
        console.log('Error adding Giscus comments', e);
      }
    } else {
      this.el.nativeElement.innerHTML = '<h6>Giscus comment is not available in DEV mode</h6>';
    }
  }
}
