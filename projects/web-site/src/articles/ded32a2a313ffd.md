---
title: "A Deep Dive into When Ionic Components Load"
description: "How Ionic lazy-loads Web Components, why UI can stutter on first paint, and preload tricks with display:none or dynamic DOM."
zennSlug: ded32a2a313ffd
emoji: "🦔"
---
This article is part of the [Ionic Framework / Capacitor / Stencil Advent Calendar 2021 Advent Calendar 2021](https://adventar.org/calendars/7114), Day 3.

* * *

Each Ionic component is built as a Web Component, completely separate from frameworks like Angular and React. For example, the `@ionic/angular` package is an Angular wrapper around those Web Components (`@ionic/core` lives inside it), and it assembles the app by calling Web Components through the wrapper.

# Understanding Lazy Loading of Ionic Components

Just as Angular and React have lazy-loading features, Ionic components have a separate lazy-loading mechanism of their own. [There is an article that explains how it works](https://stenciljs.jp/blog/how-lazy-loading-web-components-work/), so I will translate the relevant part here.

> When lazy loading is enabled, as soon as one component is added to the DOM, a proxy component requests the component's core logic and asynchronously connects it to the host element on demand. It is important that the entire runtime architecture enables Web Components to be hydrated asynchronously—getting and setting properties, catching events before full hydration, and preventing component flicker before load.

> In addition, Stencil performs static analysis of each component at build time and understands which components already work together and should be bundled together. That analysis means each bundle request already includes components known to be needed, avoiding unnecessary HTTP requests. Components also use browser APIs to load modules, so you can take advantage of native module preloading without adding runtime or custom configuration.

Let us actually watch lazy loading in action. DevTools make this easy. First, `main.js` loads at startup. If you look at the built files locally, you can see that Web Components are defined inside it.

```
const X=[],xe=I.exclude||[],Fe=z.customElements ... $lazyBundleIds$=me[0],!xe.includes(Xe)&&!Fe.get(Xe)&&(X.push(Xe),Fe.define(Xe,Jr(ft,Le,1))

```

The bundle is minified and hard to read, but variable `Fe` is assigned `customElements`, and `Fe.define` defines the Web Components. As you can see, the definition site and each component file live in different places, so in Ionic/Angular you cannot detect when each component file loads with `customElements.whenDefined`.

Each component file loads when that component **first appears in the DOM tree**. For example, this is what happens for `ion-searchbar`—when it appears on the DOM, a file like this loads.

![](https://static.zenn.studio/user-upload/45cfdb57d45c-20211201.jpeg)

At the same time, a style is injected into the header to apply styling.

![](https://static.zenn.studio/user-upload/cd14d80de777-20211201.jpeg)

This is a very well-designed mechanism: loading happens only on the first visit, and the `.hydrated` class controls visibility so you do not get jank where CSS applies or fails to apply while waiting for the load.

# Getting Past the Stutter Anyway

Even with an efficient setup, you cannot drive lazy-load delay to zero. Take a look at this.

![](https://static.zenn.studio/user-upload/b881459ea036-20211201.gif)

It happens too quickly to be sure, but `ion-searchbar` has `connectedCallback` (a Web Components lifecycle method that runs when the component is displayed).

[https://github.com/ionic-team/ionic-framework/blob/main/core/src/components/searchbar/searchbar.tsx#L203-L205](https://github.com/ionic-team/ionic-framework/blob/main/core/src/components/searchbar/searchbar.tsx#L203-L205)

I suspect the component becomes `.hydrated` and then this event runs, which causes the stutter, but let us set the cause aside—the stutter is real.

So how do you get past it? The hint is right in "as soon as one component is added to the DOM"—if you add it to the DOM first, loading and `connectedCallback` run ahead of time. The simplest approach is this.

```
<div style="display: none">
  <ion-searchbar></ion-searchbar>
</div>

```

Put components you want to preload in `index.html` with `display: none`. However, you might want to preload only in certain scenarios and not pay the cost on every page load. In that case, building the DOM dynamically in an earlier component is another option.

```
ionViewDidEnter() {
  const preloadArea: HTMLElement = document.getElementById('preload');
  preloadArea.appendChild(document.createElement('ion-searchbar'));
}

```

# Closing

For performance tuning, checking the network in DevTools and verifying what loads in which order matters. You can implement without knowing any of this, but as a next step, thinking like the browser while you build will deepen your understanding.

See you next time.
