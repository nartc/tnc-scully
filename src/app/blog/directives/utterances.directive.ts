import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appUtterances]',
})
export class UtterancesDirective implements AfterViewInit {
  @Input() appUtterances = false;

  constructor(private readonly renderer: Renderer2, private readonly el: ElementRef) {
  }

  ngAfterViewInit() {
    if (this.appUtterances) {
      try {
        const scriptEl: HTMLScriptElement = this.renderer.createElement('script');
        scriptEl.async = true;
        scriptEl.src = 'https://utteranc.es/client.js';
        scriptEl.setAttribute('repo', 'nartc/tnc-scully-comments');
        scriptEl.setAttribute('issue-term', 'pathname');
        scriptEl.setAttribute('id', 'utterances');
        scriptEl.setAttribute('theme', 'preferred-color-scheme');
        scriptEl.setAttribute('crossorigin', 'anonymous');
        this.renderer.appendChild(this.el.nativeElement, scriptEl);
      } catch (e) {
        console.log('Error adding utterances comments', e);
      }

    } else {
      this.el.nativeElement.innerHTML = '<h6>Utterances comment is not available in DEV mode</h6>';
    }

  }
}
