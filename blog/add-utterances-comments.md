---
title: Add Utterances comments to Scully
description:
  Engagement is what I have always wanted to achieve for my personal blog and so far, there is no easier
  implementation than Utterances.
date: '2020-08-27'
published: true
slug: 'add-utterances-comments-scully'
tags: ['Scully']
---

Ever since I started working and publishing my personal blog, I've always wanted to add a **Comment** section to
improve engagement with everybody. However, there has been no easy solution at all, until [Utterances](https://utteranc.es/).
<br><br>
Before knowing about Utterances (via [Tania's blog post](https://www.taniarascia.com/adding-comments-to-my-blog/)), either thought about rolling my own solution with low barrier of **Authentication** or implement something like
**Disqus** with all the API keys and such. Either way, I mostly forgot to implement it considering the amount of work I needed to do.
<br><br>
With Utterances, I need to create a [repository for comments](https://github.com/nartc/tnc-scully-comments) because
Utterances works based on Github Issues (😛, how neat is that!) and setup Utterances app with that repository. That's
all I needed to do for setting up.
<br><br>
Implementing is just as easy. All I did was to implement a **directive** as all Utterances needs is to inject a
`<script>` tag where you want to display your comment section, which for me, is at the end of each blog post. Here's
the directive code:

###### **utterances.directive.ts**

```ts
import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appUtterances]',
})
export class UtterancesDirective implements AfterViewInit {
  @Input() appUtterances = false;

  constructor(private readonly renderer: Renderer2, private readonly el: ElementRef) {}

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
```

Add the following to `blog.component.html`:

###### **blog.component.html**

```html
<div [appUtterances]="isProd"></div>
```

> `isProd` is `environment.production` because I only want to render the Comment Section in production environment.>

That's it. Have fun and good luck 👋
