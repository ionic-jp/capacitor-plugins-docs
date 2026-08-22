---
title: "Understanding Large Title in the Ionic Framework Starter Template"
description: "How Ionic reproduces iOS Large Title with dual ion-header, collapse=condense, size=large, and when to remove it."
zennSlug: bf448fedc16edd
emoji: "🍎"
---
Maybe because Ionic Framework was adopted one after another at major companies like Aeon, Sumitomo Mitsui Banking Corporation, and Minna no Ginko, I am hearing starter-level questions again.

[https://twitter.com/rdlabo/status/1433224578923319296](https://twitter.com/rdlabo/status/1433224578923319296)

Ionic 5 shipped in February 2020, so this feels a little late, but I will explain Large Title as used in the current starter template.

# What Is Large Title?

It is the interface Apple adopted in iOS 11.

![](https://static.zenn.studio/user-upload/461baca55b265312081a7745.png)  
[Navigation Bar Titles - Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/bars/navigation-bars/)

Its behavior is as follows.

-   When you scroll, the Large Title shrinks into the normal title
-   On a push transition, the back button on the destination shows that title

The animation makes it clear. The title below is the Large Title.

![](https://res.cloudinary.com/zenn/image/fetch/s--xDdOxDTk--/https://assets.st-note.com/production/uploads/images/19240088/picture_pc_51189abd36e942b2fee6e745b1c138ab.gif%3Fwidth%3D800)

# How Ionic Reproduces It

Ionic is known for faithfully reproducing native UI. To reproduce this behavior faithfully, it uses the following implementation. This is from the BLANK starter template.

```
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>
      Blank
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">Blank</ion-title>
    </ion-toolbar>
  </ion-header>

  <div id="container">
    <strong>Ready to create an app?</strong>
    <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
  </div>
</ion-content>

```

Look closely and you will see `ion-header` appears twice—once at the top and once directly under `ion-content`. The `ion-title` under the first `ion-header` is the normal title; the `ion-title` under `ion-header` inside `ion-content` is the Large Title. They switch automatically when `ion-content` scrolls.

The important attributes for Large Title are `size="large"` and `collapse="condense"`. `size="large"` simply makes the title larger (`font-size`). With `collapse="condense"`, the `ion-title` under the other `ion-header` is hidden. When `ion-content` scrolls, visibility toggles at a threshold.

This applies only in iOS Design, so it is hidden by default on Android. To check iOS design during development, see:

[https://www.asobou.co.jp/blog/web/gcd-check](https://www.asobou.co.jp/blog/web/gcd-check)

# To Understand It Better

## Try Removing `size="large"`

```
  <ion-content [fullscreen]="true">
    <ion-header collapse="condense">
      <ion-toolbar>
-       <ion-title size="large">Blank</ion-title>
+       <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

```

Of course the Large Title becomes smaller.

![](https://static.zenn.studio/user-upload/71c133c9d27ef60fd373a0cd.png)

By the way, Large Title text in Japanese gets slightly clipped at the top, so I recommend 30px for Japanese (default is 44px).

```
ion-title[size="large"] {
  font-size: 30px;
}

```

## Try Removing `collapse="condense"`

Change your project like this.

```
  <ion-content [fullscreen]="true">
-   <ion-header collapse="condense">
+   <ion-header>

```

Without internal priority between the two `ion-header` blocks, you get this—both titles show.

![](https://static.zenn.studio/user-upload/78aa1f9807e09e26a9ba1edb.png)

# When You Do Not Use Large Title

If you use it, the starter template is fine as is. If you do not, delete `ion-content > ion-header` entirely. That lets you use Ionic on iOS without Large Title.

See you next time.
