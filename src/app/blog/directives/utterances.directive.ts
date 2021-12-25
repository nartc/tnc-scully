import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Inject, Input } from '@angular/core';

@Directive({
  selector: '[appUtterances]',
})
export class UtterancesDirective implements AfterViewInit {
  @Input() appUtterances = false;

  constructor(@Inject(DOCUMENT) private document: Document, private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    if (this.appUtterances) {
      try {
        const scriptEl = this.document.createElement('script');
        scriptEl.async = true;
        scriptEl.src = 'https://utteranc.es/client.js';
        scriptEl.setAttribute('repo', 'nartc/tnc-scully-comments');
        scriptEl.setAttribute('issue-term', 'pathname');
        scriptEl.setAttribute('id', 'utterances');
        scriptEl.setAttribute('theme', 'preferred-color-scheme');
        scriptEl.setAttribute('crossorigin', 'anonymous');
        this.el.nativeElement.appendChild(scriptEl);
      } catch (e) {
        console.log('Error adding utterances comments', e);
      }
    } else {
      this.el.nativeElement.innerHTML = '<h6>Utterances comment is not available in DEV mode</h6>';
    }
  }
}
