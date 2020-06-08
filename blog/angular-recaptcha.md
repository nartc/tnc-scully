---
title: Add Google ReCaptcha v2 to Angular
description: Adding ReCaptcha (v2) to Angular is made super easy with the help of Directives and Dependency Injection
date: '2020-06-07'
published: true
slug: 'angular-recaptcha-v2'
tags: ['Angular']
---

Hi guys 👋, I have just worked on a task to add [Google ReCaptcha](https://developers.google.com/recaptcha/docs/display), specifically Google ReCaptcha v2 with Checkbox,
to our Angular application. Adding ReCaptcha to a web application is very straight forward but making it work with Angular syntax as well as synchronize ReCaptcha events
with Angular's Event Binding requires a little bit extra work. Nonetheless, the process is made extremely easy with Angular mechanism revolving `Directives` and `Dependency Injection`.

### Setup ReCaptcha

Let's prepare some ground work by requesting a pair of `API Keys` for your ReCaptcha site.

1. Go to [Google ReCaptcha Admin](http://www.google.com/recaptcha/admin) to start setting up your site. Remember to pick `v2 Checkbox`
2. Grab your pair of `API Keys`, specifically `SITE_KEY` and `SECRET_KEY`

<iframe width="575" height="400" frameborder="0" allowtransparency="true" allowfullscreen="allowfullscreen" src="https://share.getcloudapp.com/wbuWNEQ9?embed=true" style="border: none;"></iframe>

_ReCaptcha_

> You'd only need the `SITE_KEY` for this tutorial since `SECRET_KEY` has to deal with setting up the server to verify the ReCaptcha token
> which we will not be going into in this blog post.

### Setup Angular

Let's just start by creating a new Angular application

```bash
npx @angular/cli new ng-recaptcha --minimal
```

Next, put your `SITE_KEY` in the `environment.ts` file

###### **environment.ts**

```typescript
export const environment = {
  // ...
  recaptchaSitekey: 'YOUR_SITE_KEY',
};
```

Now, let's generate the `RecaptchaDirective`

```bash
ng g directive recaptcha
```

### RecaptchaDirective

##### Injected services

First, we are going to inject some essential things to `RecaptchaDirective`

###### **recaptcha.directive.ts**

```typescript
@Directive({
  selector: '[appRecaptcha]',
})
export class RecaptchaDirective {
  constructor(
    private readonly elementRef: ElementRef,
    private readonly ngZone: NgZone,
    @Inject(DOCUMENT) private readonly dom: Document,
  ) {}
}
```

1. `elementRef`: This is the DOM Element that we are going to mount our `RecaptchaDirective` on. We need the DOM Element because
   we will use this DOM Element as a host to render the ReCaptcha Widget from Google.
2. `ngZone`: ReCaptcha Widget does emit some events on its own and those events will be emitted outside of Angular so we need
   `NgZone` to force run some logic inside of Angular so `ChangeDetection` plays nice with those events.
3. `dom`: This is just the `document` object but with a recommended way to use `DOCUMENT` token from Angular. We need the `dom`
   to create ReCaptcha `<script>` tag and append it to the `<body>` tag.

##### Event Emitters

Second, we are going to setup three `EventEmitter`. ReCaptcha essentially emits three events: `success`, `error`, and `expired` with the last
two being optional. But, we are going to provide all three.

###### **recaptcha.directive.ts**

```typescript
@Directive({
  /*...*/
})
export class RecaptchaDirective {
  @Output() recaptchaSuccess = new EventEmitter<string>();
  @Output() recaptchaExpired = new EventEmitter<unknown>();
  @Output() recaptchaError = new EventEmitter<unknown>();

  private readonly scriptId = 'recaptcha-script';
  private widgetId: number;

  constructor(/*...*/) {}
}
```

> We also declare two fields `scriptId` and `widgetId`. `scriptId` is just for convenience purposes when we add the `<script>` tag.
> `widgetId` is to just keep track of the ReCaptcha Widget

##### Initialize ReCaptcha

Next, we are going to need some methods for initializing ReCaptcha Widget

###### **recaptcha.directive.ts**

```typescript
@Directive({
  /*...*/
})
export class RecaptchaDirective {
  // ...

  constructor(/*...*/) {}

  private registerCaptchaCallback() {
    window.recaptchaCallback = () => {
      const config = {
        sitekey: environment.recaptchaSitekey,
        callback: this.onSuccessCallback.bind(this),
        'error-callback': this.onErrorCallback.bind(this),
        'expired-callback': this.onExpiredCallback.bind(this),
      };
      this.widgetId = this.renderCaptcha(config);
    };
  }

  private renderCaptcha(config: any): number {
    return window.grecaptcha.render(this.elementRef.nativeElement, config);
  }

  private addScript() {
    if (this.dom.getElementById(this.scriptId) != null) {
      return;
    }

    const script = this.dom.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit';
    script.id = this.scriptId;
    script.async = true;
    script.defer = true;
    this.dom.body.appendChild(script);
  }
}
```

When you setup ReCaptcha Widget, you'd need to load the `recaptcha.js` `<script>` tag somewhere in your HTML code. However,
we are loading the `<script>` dynamically here in `addScript()` method.

Pay close attention to the `script.src: 'https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit'`. The two
Query Parameters `onload` and `render` are required. `render=explicit` tells Google that we want to take charge of rendering the ReCaptcha Widget.
`onload=recaptchaCallback` tells Google to call a function named `recaptchaCallback` when the script is loaded successfully.

> `recaptchaCallback` is just a function name. You can choose whatever name you like.

1. `addScript()`: In this method, we check if we already loaded the `<script>`, if yes, we just stop executing with `return;`. If we haven't loaded
   the `<script>`, we start by creating a `script` element and assign the values to it, then we append the `script` to the `<body>`
2. `renderCaptcha()`: This method takes in a `config` object and call `grecaptcha.render()`. `grecaptcha` will be available as a property on
   `Window` object as soon as the `<script>` in `addScript()` loads successfully. `render()` method takes in a DOM element and a `config` object
   which we both have: `elementRef.nativeElement` and the passed-in `config` object.
3. `registerCaptchaCallback()`: In this method, we define the `onload` callback function (Remember in this blog, the function name is `recaptchaCallback`)
   as a property on the `Window` object. `recaptchaCallback` will construct the `config` object with the `sitekey` and three events that
   ReCaptcha will emit which we mentioned earlier. We save `sitekey` as an Environment Variable in `environment.ts` earlier as well. Finally, we call
   `renderCaptcha()` and assign the returned value to `widgetId`.

At this point, you'd probably have TypeScript screaming at you for some typings problem because we mingle with the `Window` object. To fix these typings issue,
let's create a `typings.d.ts` file on the same level as `main.ts`. Chances are you might have a `types.d.ts` or something similar, if not,
go ahead and create `typings.d.ts`.

###### **typings.d.ts**

```typescript
declare global {
  interface Window {
    recaptchaCallback: () => void;
    grecaptcha: {
      render: (...args: any[]) => number;
    };
  }
}
```

Here, we just add to the `Window` interface some properties we added to the `Window` object in `RecaptchaDirective` a moment ago. Now, TypeScript should be happy again.

##### Wire up Angular Event Emitters

We are almost there. Let's wire up those `success`, `error`, and `expired` callbacks.

###### **recaptcha.directive.ts**

```typescript
@Directive({
  /*...*/
})
export class RecaptchaDirective {
  // ...

  constructor(/*...*/) {}

  private registerCaptchaCallback() {
    /*...*/
  }

  private renderCaptcha(config: any) {
    /*...*/
  }

  private addScript() {
    /*...*/
  }

  private onSuccessCallback(token: string) {
    this.ngZone.run(() => {
      this.recaptchaSuccess.emit(token);
    });
  }

  private onErrorCallback() {
    this.ngZone.run(() => {
      this.recaptchaError.emit();
    });
  }

  private onExpiredCallback() {
    this.ngZone.run(() => {
      this.recaptchaExpired.emit();
    });
  }
}
```

Straightforward enough, we just wire those callbacks up and have our `EventEmitter` emitting as `@Output`. `success` callback does
get called with a `token`. You'll notice here we wrap the `EventEmitter` emitting in `ngZone.run` because Google calls those callbacks
outside of Angular so we need to force the `@Output` to emit inside of Angular using `NgZone`.

> `token` is for when you want to verify with the server side with the `SECRET_KEY`

##### RecaptchaDirective Life Cycle Hooks

Last step is to call our methods in some life cycle hooks

```typescript
@Directive({
  /*...*/
})
export class RecaptchaDirective implements OnInit, OnDestroy {
  // ...

  constructor(/*...*/) {}

  ngOnInit() {
    this.registerCaptchaCallback();
    this.addScript();
  }

  ngOnDestroy() {
    this.widgetId = null;
  }

  private registerCaptchaCallback() {
    /*...*/
  }

  private renderCaptcha(config: any) {
    /*...*/
  }

  private addScript() {
    /*...*/
  }

  private onSuccessCallback(token: string) {
    /*...*/
  }

  private onErrorCallback() {
    /*...*/
  }

  private onExpiredCallback() {
    /*...*/
  }
}
```

We only use two hooks `OnInit` and `OnDestroy` where we call `registerCaptchaCallback()` along with `addScript()` in `OnInit`. Then, we nullify
the `widgetId` in `OnDestroy`.

### Usage

`RecaptchaDirective` is ready to rock. Let's open up `app.component.ts` and add a `<div>` in the `template` with our directive mount to it

###### **app.component.ts**

```typescript
@Component({
  selector: 'app-root',
  template: `
    <div appRecaptcha (recaptchaSuccess)="onRecaptchaSuccess($event)"></div>
    <p>{{ token }}</p>
  `,
})
export class AppComponent {
  token: string;
  onRecaptchaSuccess(token: string) {
    this.token = token;
  }
}
```

If you have ReCaptcha setup correctly, you'll see the ReCaptcha Widget v2 Checkbox appear when you run the application. Checking the box will display the `token`
on the screen as well.

### Where to go from here

Now you can capture the user's verification token from the ReCaptcha Widget. With this token, you need to verify it by standing up an endpoint that will call
a Google ReCaptcha endpoint with the `token` and `SECRET_KEY` to verify the authenticity of the `token`. The result of this endpoint will determine the next
flow of action for the users.

### Demo

<iframe width="100%" height="500" src="https://stackblitz.com/edit/angular-recaptcha-v2?ctl=1&embed=1&file=src/app/recaptcha.directive.ts"></iframe>

> Remember to switch `YOUR_SITE_KEY` to your actual `SITE_KEY`
