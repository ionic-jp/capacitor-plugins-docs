---
title: "NativeScript for Capacitor and Its Plugins Hit Beta—Access Native APIs Directly from JavaScript"
description: "NativeScript for Capacitor beta lets hybrid apps call iOS and Android APIs from JavaScript—plus @nativescript-community/capacitor-plugins for reuse."
zennSlug: f66b43bc8aca6b
emoji: "✨"
---

This article as English is here:  
[https://nativescript.org/blog/nativescript-for-capacitor-explained/](https://nativescript.org/blog/nativescript-for-capacitor-explained/)

# Description

-   With NativeScript for Capacitor, JavaScript can access device Native APIs directly
-   What used to require Swift or Java can now be done entirely in JavaScript
-   With `@nativescript-community/capacitor-plugins`, you can use plugins for NativeScript for Capacitor
-   If you know web technology, the era when you can ship store apps is here

# 1. What Is NativeScript for Capacitor?

The world has moved fast. With Capacitor—the library for modern hybrid development (mobile apps using WebView)—JavaScript can now access Native APIs **directly**.

Yes—with NativeScript for Capacitor!

[https://capacitor.nativescript.org/](https://capacitor.nativescript.org/)

## What Became Possible

`NativeScript for Capacitor` exposes methods that closely match the device Native APIs.

Here is an example. On iOS, to set device brightness you assign a value to the `brightness` property on the main screen object from `mainScreen()` on the device object `UIScreen`.

Swift Code:

plugin.swift

```
UIScreen.mainScreen().brightness = 1

```

NativeScript for Capacitor provides the matching `UIScreen`, `mainScreen`, and `brightness`, so you can write it in JavaScript like this.

NativeScript for Capacitor code:

plugin.js

```
UIScreen.mainScreen.brightness = 1

```

Almost the same, right?

On Android in Java (SDK>24/canWrite), setting brightness requires configuring `Settings.System.putInt` like this.

Java Code:

plugin.java

```
Settings.System.putInt(
  contentResolver, 
  Settings.System.SCREEN_BRIGHTNESS,
  100
);

```

NativeScript for Capacitor exposes a `Settings` object under `android.provider`, so you can write:

NativeScript for Capacitor code:

plugin.js

```
android.provider.Settings.System.putInt(
  context.getContentResolver(),
  android.provider.Settings.System.SCREEN_BRIGHTNESS,
  100
);

```

So cross-platform code for iOS and Android looks like this.

NativeScript for Capacitor code:

plugin.js

```
if (!native.isIOS) {
  UIScreen.mainScreen.brightness = 1
} else {
  android.provider.Settings.System.putInt(
    context.getContentResolver(),
    android.provider.Settings.System.SCREEN_BRIGHTNESS,
    100
  );
}

```

NativeScript for Capacitor means JavaScript in a WebView can reach device Native APIs.

## Could You Not Do This Before?

In Capacitor, "Capacitor plugins" are the mechanism for Native API access (Cordova plugins work too, but the structure is the same, so I will skip them). Those plugins implement Native-side code to reach device APIs. In other words, **Capacitor plugins required writing Swift and Java.**

The plugin mechanism was also the interface for calling that code from JavaScript and receiving events.

```
Plugin.java (your work) - JavascriptInterface - JavaScript(your work)
Plugin.swift(your work) - WKUserScript - JavaScript(your work)

```

NativeScript for Capacitor, by contrast, provides interfaces to each device's Native APIs, so you can write only JavaScript.

```
NativeScript of iOS     - JavaScript(your work only!)
NativeScript of Android - JavaScript(your work only!)

```

That is the biggest difference.

> Footnote:  
> You still need Capacitor plugins for third-party libraries. For example, `@capacitor-community/admob` uses `Google-Mobile-Ads-SDK` on iOS and `com.google.android.gms:play-services-ads` on Android. At the moment you cannot use such third-party libraries through NativeScript for Capacitor.

# 2. @nativescript-community/capacitor-plugins for Better Reuse

NativeScript for Capacitor is powerful, but the rule that code lives in a project-specific file `src/nativescript/index.ts` hurt reuse and maintainability. You can get sample code, but copy-pasting means you miss updates. You also could not share code across projects.

To fix that I built `@nativescript-community/capacitor-plugins`. It strongly supports projects that adopt NativeScript for Capacitor.

Getting started is easy.

```
% npm --save @nativescript-community/capacitor-plugins

```

Install it, then rewrite `src/nativescript/index.ts` like this.

```
  import '@nativescript/capacitor/bridge';
+ import * as Plugins from '@nativescript-community/capacitor-plugins';

+ native = Object.assign(native, Plugins);
...

```

Similarly, update `src/native-custom.d.ts`.

```
+ import type { pluginsGlobal } from '@nativescript-community/capacitor-plugins/src/interfaces';

  declare module '@nativescript/capacitor' {
    export interface customNativeAPI extends nativeCustom {}
  }

  /**
   * Define your own custom strongly typed native helpers here.
   */
- export interface nativeCustom {
+ export interface nativeCustom extends pluginsGlobal {

```

That is enough to use the methods this plugin provides. For details see

[https://github.com/nativescript-community/capacitor-plugins#usage](https://github.com/nativescript-community/capacitor-plugins#usage)

## Help contribution

Plugins improved reuse, but right now there is only one method—for adjusting brightness. This plugin works with the NativeScript team's

[https://capacitor.nativescript.org/swag-contest.html](https://capacitor.nativescript.org/swag-contest.html)

Please help build the kinds of solutions they suggest.

# Conclusion

With Capacitor you can build apps with web technology that feel like native apps written in Swift or Java. Until now, reaching device Native APIs directly still required Swift/Java, but NativeScript for Capacitor removes much of that constraint.  
And with `@nativescript-community/capacitor-plugins`, JavaScript that uses NativeScript can be reused and distributed too.

If you have web skills, there is no reason left not to ship store apps!
