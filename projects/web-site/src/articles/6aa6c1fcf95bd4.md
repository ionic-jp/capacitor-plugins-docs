---
title: "Designing Loading Controller Code for Network Requests in Ionic Angular"
description: "Move LoadingController presentation and dismissal into a service with RxJS so page components stay thin during HTTP calls."
zennSlug: 6aa6c1fcf95bd4
emoji: "🐕"
---

This article is part of the [Ionic Framework / Capacitor / Stencil Advent Calendar 2021](https://adventar.org/calendars/7114).

---

You often want to show a Loading Controller during network requests. If you write it directly in a page component without thinking, it looks like this:

```ts
async connectEvent():void {
  const loading = await this.loadingController.create();
  await loading.present();
  this.httpClient.get<Type>(url)
    .subscribe({
      next: () => {},
      error: () => {},
      complete: () => {
        loading.dismiss();
      },
    });
}
```

However, if you handle values here, everything ends up inline in the page component, which is tedious. Moving it to a service looks like this:

```ts
async getData(): Observable<Type> {
  return from(this.loadingController.create().then(d => d.present())).pipe(
    concatMap(() => 
        this.httpClient.get<Type>(url)
            .pipe(
              finalize(() => this.loadingController.dismiss())
            )
    ));
}
```

Because `loadingController.create()` is Promise-based, convert it with `from()`. Then use `concatMap` to tie it to the request, and call `dismiss` in `finalize` when the request completes.

With that, the page can be written like this:

```ts
connectEvent() {
  this.service.getData().subscribe(/.../)
}
```

That alone shows the loading indicator and dismisses it when the request finishes.
Tying request-related behavior to the service side and handling it automatically keeps page components easier to read. See you next time.
