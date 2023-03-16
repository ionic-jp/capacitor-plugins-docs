---
title: "IdentityVerificationSheet"
code: []
scrollActiveLine: []
---

IdentityVerificationSheetは、Stripe Identityを使用できます。Stripe Identityを使用すると、グローバルユーザーの身元をプログラムで確認できるため、詐欺師からの攻撃を防ぐと同時に、正当な顧客の摩擦を最小限に抑えることができます。これは簡単な方法です。__この機能は日本ではまだ利用することはできません。__

## Androidでのインストール

あなたのプロジェクトの `AndroidManifest.xml` と `res/values/strings.xml` を以下のように変更してください。

```diff xml: AndroidManifest.xml
+ <meta-data
+   android:name="com.getcapacitor.community.stripe.enableIdentifier"
+   android:value="@bool/enableIdentifier"/>
```

```diff xml: strings.xml
+ <bool name="enableIdentifier">true</bool>
```

また、 `res/values/styles.xml` を以下のように変更してください。

```diff xml: res/values/styles.xml
- <style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
+ <style name="AppTheme" parent="Theme.MaterialComponents.DayNight">
```

`parent` に指定するMaterialComponentsはどれでも可能です。 [詳細はこちらをご覧ください。](https://m2.material.io/develop/android/theming/dark/).
すべてのプロセスはこちらにあります。 https://github.com/capacitor-community/stripe/commit/f514d893e9193bed2edbaf52c0d3ed1d534c7890

## 使い方

```ts
import { Stripe } from '@capacitor-community/stripe';

await Stripe.createIdentityVerificationSheet({
  ephemeralKeySecret,
  verificationId,
});
const result = await Stripe.presentIdentityVerificationSheet();
```

## 🐾 Implements Guide
### 1. createIdentityVerificationSheet

Props `ephemeralKeySecret` and `verificationId` is required. This requires to generate at server side. See [Stripe Identity](https://stripe.com/docs/identity) for more details.
https://stripe.com/docs/identity/verify-identity-documents?platform=ios&type=new-integration#create-a-verificationsession

```ts
import { Stripe } from '@capacitor-community/stripe';

(async () => {
  // Connect to your backend endpoint, and get every key.
  const { verficationSessionId, ephemeralKeySecret } = await this.http.post<{
    verficationSessionId: string;
    ephemeralKeySecret: string;
  }>(environment.api + 'identify', {}).pipe(first()).toPromise(Promise);

  // prepare IdentityVerificationSheet with createIdentityVerificationSheet.
  await Stripe.createIdentityVerificationSheet({
    ephemeralKeySecret,
    verificationId: verficationSessionId,
  })
})();
```

You can use options of `CreateIdentityVerificationSheetOption` on `createIdentityVerificationSheet`.

!::createIdentityVerificationSheet::

Props `ephemeralKeySecret` and `verificationId` is required.

!::CreateIdentityVerificationSheetOption::

### 2. presentIdentityVerificationSheet

When you do `presentIdentityVerificationSheet` method, plugin present PaymentSheet and get result. This method must do after `createIdentityVerificationSheet`.

```ts
(async () => {
  // present IdentityVerificationSheet and get result.
  const result = await Stripe.presentIdentityVerificationSheet()
  if (result.identityVerificationResult === IdentityVerificationSheetEventsEnum.Completed) {
    // Happy path
  }
})();
```

You can get `IdentityVerificationSheetResultInterface` from `presentIdentityVerificationSheet`.

!::presentIdentityVerificationSheet::

`IdentityVerificationSheetResultInterface` is created from Enum of `IdentityVerificationSheetEventsEnum`. So you should import and check result.

!::IdentityVerificationSheetResultInterface::

!::IdentityVerificationSheetEventsEnum::


### 3. addListener

Method of IdentityVerificationSheet notify any listeners. If you want to get event of IdentityVerificationSheet process is 'Completed', you should add `IdentityVerificationSheetEventsEnum.Completed` listener to `Stripe` object:

```ts
// be able to get event of IdentityVerificationSheet
Stripe.addListener(IdentityVerificationSheetEventsEnum.Completed, () => {
  console.log('IdentityVerificationSheetEventsEnum.Completed');
});
```

The event name you can use is `IdentityVerificationSheetEventsEnum`.

!::IdentityVerificationSheetEventsEnum::