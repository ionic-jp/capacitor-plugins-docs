---
title: "Handling capacitor/ios Keyboard Resize Yourself Makes It Smoother"
description: "Disable Capacitor's default iOS keyboard resize and animate margin-bottom on keyboardWillShow for smoother fixed-footer input UX."
zennSlug: dd7abeaefdb76d
emoji: "🙌"
---
On Android, the WebView resizes automatically when the keyboard appears (the OS handles the resize). On iOS, it does not resize automatically. So with a fixed footer input form like LINE's, you need to resize by the keyboard height yourself.

Capacitor provides that resize behavior through `Keyboard > resize` in `capacitor.config.json`.

[https://capacitorjs.jp/docs/apis/keyboard#keyboard-configuration-ios-only](https://capacitorjs.jp/docs/apis/keyboard#keyboard-configuration-ios-only)

In practice, though, resize runs **after** the keyboard appears, and watching it in action feels off.

![](https://static.zenn.studio/user-upload/t50i8389xinbgyu68so1ocbmec6t)

There is no Capacitor setting to smooth this out right now, so let's smooth it ourselves.

First, turn off Capacitor's resize feature. Disable it in `capacitor.config.json`.

```
...
  "plugins": {
    "Keyboard": {
      "resize": "none"
    }
  }

```

Set `resize: none`. While you are at it, configure animation in CSS so the resize looks smooth when the keyboard appears. For Ionic/Angular that is `ion-app`; in React or Vue projects, use the matching selector.

```
ion-app {
  margin-bottom: 0;
  transition: margin-bottom 420ms;
}

```

Finally, change the WebView when the keyboard appears. Register listeners when the first component loads.

```
if (this.platform.is('ios')) {
    window.addEventListener('keyboardWillShow', (e) => {
      const app: HTMLElement = document.querySelector('ion-app');
      app.style.marginBottom = (e as any).keyboardHeight + 'px';
  });
  window.addEventListener('keyboardWillHide', (e) => {
    const app: HTMLElement = document.querySelector('ion-app');
    app.style.marginBottom = '0px';
  });
}

```

Now when the keyboard appears, the view's `marginBottom` grows by the keyboard height, and the transition animates that change.  
It behaves something like this:

[https://twitter.com/rdlabo/status/1332656964166320129](https://twitter.com/rdlabo/status/1332656964166320129)

Simple, right? Because iOS keyboard animation speed is not constant, a CSS transition will drift slightly if you care about precision—tune the animation points further if you want. If you build this, I would appreciate a mention in the following issue.

[https://github.com/ionic-team/capacitor/issues/1540#issuecomment-735221275](https://github.com/ionic-team/capacitor/issues/1540#issuecomment-735221275)

See you again.
