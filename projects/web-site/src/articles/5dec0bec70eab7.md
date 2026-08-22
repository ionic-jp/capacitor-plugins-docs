---
title: "How OSS Work to Help Web Developers Earn Led to Stripe Sponsorship"
description: "From Ionic meetups and Capacitor plugins to GitHub Sponsors support from Stripe—how practical open-source sharing turned into sponsorship."
zennSlug: 5dec0bec70eab7
emoji: "🎉"
---

While doing OSS work, I learned that Stripe, the online payments platform, will support me through GitHub Sponsors.

[https://github.com/sponsors/rdlabo](https://github.com/sponsors/rdlabo)

After Cybozu's ["Donating as a Company Through GitHub Sponsors"](https://blog.cybozu.io/entry/2021/03/19/110000), Japan has talked more about supporting and receiving support for OSS. Here is a short summary of what I have been doing.

## [Web Developer = Me] Wanted an Environment Where I Could Earn

I think it started in 2017 (already five years ago!) when I hosted an Ionic Framework event in Tokyo for building mobile apps with web technology. Ionic was less popular in Japan then, and fresh know-how and case studies were scarce, so I ran a meetup to gather them. Next I worked on the [Ionic Japanese documentation](https://ionicframework.jp/docs/). I hoped that readable Japanese docs would grow the user base and produce more know-how.

Looking at how Angular, React, and Vue evolved, how adoption grew, and how Ionic now powers major apps like the [Sumitomo Mitsui Banking app](https://www.smbc.co.jp/kojin/spaplli/directapp/) and services such as [TechFeed](https://techfeed.io/) and [Weekend Model](https://weekend-model.com/), it feels like another era!

What drew me to Ionic was writing one codebase and shipping not only on the web but also to the App Store and Google Play. SEO was already a buzzword, but ultimately it is about expanding user touchpoints through search tools. If you app-ify your product, you can "add more user touchpoints." In client work that can mean higher rates—maybe more than three times what you charge for a web app alone! (Native work tends to pay more.)

One tool that supports that is Capacitor, a cross-platform library. I explain what it means to me in ["Where Capacitor Fits for Me, and What It Means for Web Developers to Build Apps with Capacitor"](https://note.com/rdlabo/n/na41578be1871), so I will skip that here. When it launched as a new library, it had one weakness.

I was adopting it as a tool to earn money, but there were not enough plugins to earn with. Broadly speaking, apps make money through:

- Client development and operations
- Affiliate income
- In-app sales

When I first thought "affiliate! AdMob (Google in-app ads)!", I realized there was no plugin to show native ads with AdMob. So I built [@capacitor-community/admob](https://www.npmjs.com/package/@capacitor-community/admob) (strictly speaking, `rahadurr`'s repository was unmaintained, so I forked it to `rdlabo`, moved it into my org, and migrated it to `capacitor-community`).

Next I thought, "If I sell physical goods in the app, I can make money." iOS and Android require in-app purchase for digital content, but physical goods are fine. I became maintainer of [@capacitor-community/stripe](https://www.npmjs.com/package/@capacitor-community/stripe) and shipped many releases. Recently that meant improving documentation.

[https://stripe.capacitorjs.jp/](https://stripe.capacitorjs.jp/)

[https://ja.stripe.capacitorjs.jp/](https://ja.stripe.capacitorjs.jp/)

While sharing this work on Twitter and elsewhere, someone at Stripe noticed and asked what I was doing around Capacitor. That led to sponsorship.

### OSS as Simple Sharing

As above, my OSS work is not especially noble:

- Ionic was not widely used in Japan and information was scarce, so I ran meetups and invited speakers
- I wanted more users and information, so I built Japanese documentation

Then:

- "Oh no, Facebook Login is in the requirements—I'll build a plugin" → [@capacitor-community/facebook-login](https://www.npmjs.com/package/@capacitor-community/facebook-login)
- "I want ads in the app" → [@capacitor-community/admob](https://www.npmjs.com/package/@capacitor-community/admob)
- "Let's sell goods" → [@capacitor-community/stripe](https://www.npmjs.com/package/@capacitor-community/stripe)

That is about it. It was not "Let us build things everyone uses and contribute!!" I built what I needed, made it public, and added a README—sharing at a low commitment level. I did get bug reports I would not have caught myself, but the mindset was "I built it, so I might as well publish it."

### Turning OSS Participation into Client Work

I also steer client work toward OSS. Since around last year, when I am asked to give a seminar and part of the [Ionic Japanese documentation](https://ionicframework.jp/docs/) or other docs is still untranslated, I propose documentation translation alongside the seminar. I also require attendees to have read the translated documentation.

For truly beginner courses, depending on the audience you often end up with people who can only finish the documentation tutorial. If they have finished the tutorial, I can talk about the next step. For example, when `capacitor-community/barcode-scanner` did not fit requirements, I built [https://github.com/rdlabo-dev/capacitor-codescanner](https://github.com/rdlabo-dev/capacitor-codescanner). In that sense, even in contract work you can make OSS part of the job through how you propose the work.

## Summary

So the OSS work Stripe evaluated was not a consistent "Let us do something great!" from the start. It was more like "I want to use this, so I will build it," "I built it, so I will share it," and "I will open-source what I build for a client."

The title says "How OSS Work to Help Web Developers Earn Led to Stripe Sponsorship," but more precisely it is:

**How OSS work by a web developer (me) to earn—meetups to gather information, tools shared along the way, paid translation of the relevant docs, and other open activity—led to Stripe sponsorship**

OSS sounds intimidating and many people think they cannot do it, but even casual sharing can be useful to someone. Beyond GitHub Sponsors, attention now comes in many forms—hiring, cheering people on, and so on. If you have work that could be public, it may be worth publishing.

I am truly grateful to Stripe for noticing this work and deciding to sponsor it!

### Bonus

Because of this news, I finally created my long-delayed GitHub Sponsors page. If your company would like to support this work, please consider it:

[https://github.com/sponsors/rdlabo](https://github.com/sponsors/rdlabo)

See you next time.
