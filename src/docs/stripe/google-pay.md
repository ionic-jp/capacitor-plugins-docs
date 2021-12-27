---
title: "Google Pay"
code: ["/docs/stripe/google-pay/strings.xml.md", "/docs/stripe/google-pay/android-manifest.xml.md", "/docs/stripe/google-pay/google-pay.ts.md"]
scrollActiveLine: []
---

With Google Pay, you can make instant payments in a single flow. Please check settings:

https://stripe.com/docs/google-pay

## 🐾 Implements

### Prepare settings
For using GooglePay, you need some settings.

#### strings.xml

In file `android/app/src/main/res/values/strings.xml` add the these value.

- publishable_key(Stripe's publoshable key)
- enable_google_pay
- country_code
- merchant_display_name
- google_pay_is_testing

These settings are used because GooglePay requires some processing to be done before initializing the plugin.

```xml
<string name="publishable_key">Your Publishable Key</string>
<bool name="enable_google_pay">true</bool>
<string name="country_code">US</string>
<string name="merchant_display_name">Widget Store</string>
<bool name="google_pay_is_testing">true</bool>
```

#### AndroidManifest.xml

In file `android/app/src/main/AndroidManifest.xml`, add the following XML elements under `manifest > application`. These call the values set in strings.xml.

```xml
<meta-data
  android:name="com.getcapacitor.community.stripe.publishable_key"
  android:value="@string/publishable_key"/>

<meta-data
  android:name="com.getcapacitor.community.stripe.enable_google_pay"
  android:value="@bool/enable_google_pay"/>

<meta-data
  android:name="com.google.android.gms.wallet.api.enabled"
  android:value="true" />

<meta-data
  android:name="com.getcapacitor.community.stripe.country_code"
  android:value="@string/country_code"/>

<meta-data
  android:name="com.getcapacitor.community.stripe.merchant_display_name"
  android:value="@string/merchant_display_name"/>

<meta-data
  android:name="com.getcapacitor.community.stripe.google_pay_is_testing"
  android:value="@bool/google_pay_is_testing"/>
```


### 1. isGooglePayAvailable
First, you should check to be able to use GooglePay on device. 

```ts
import { Stripe, GooglePayEventsEnum } from '@capacitor-community/stripe';

(async () => {
  // Check to be able to use GooglePay on device
  const isAvailable = Stripe.isGooglePayAvailable().catch(() => undefined);
  if (isAvailable === undefined) {
    // disable to use GooglePay
    return;
  }
})();
```

This method return `resolve(): void` or `reject('Not implemented on Device.')`. 

!::isGooglePayAvailable::


### 2. createGooglePay

You should connect to your backend endpoint, and get every key. This is "not" function at this Plugin. So you can use `HTTPClient` , `Axios` , `Ajax` , and so on.

Stripe provide how to implement backend:
https://stripe.com/docs/payments/accept-a-payment?platform=ios#add-server-endpoint

After that, you set these key to `createGooglePay` method.

```ts
(async () => {
  // Connect to your backend endpoint, and get paymentIntent.
  const { paymentIntent } = await this.http.post<{
    paymentIntent: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);

  // Prepare GooglePay
  await Stripe.createGooglePay({
    paymentIntentClientSecret: paymentIntent,
  });
})();
```

!::createGooglePay::


You can use options of `CreateGooglePayOption` on `createGooglePay`. 

!::CreateApplePayOption::

### 3. presentGooglePay

present in `createGooglePay` is single flow. You don't need to confirm method.

```ts
(async () => {
  // Present GooglePay
  const result = await Stripe.presentGooglePay();
  if (result.paymentResult === GooglePayEventsEnum.Completed) {
    // Happy path
  }
})();
```

!::presentGooglePay::

`GooglePayResultInterface` is created from Enum of `GooglePayEventsEnum`. So you should import and check result.

!::GooglePayResultInterface::


### 4. addListener

Method of GooglePay notify any listeners. If you want to get event of payment process is 'Completed', you should add `GooglePayEventsEnum.Completed` listener to `Stripe` object:

```ts
// be able to get event of PaymentSheet
Stripe.addListener(GooglePayEventsEnum.Completed, () => {
  console.log('GooglePayEventsEnum.Completed');
});
```

The event name you can use is `GooglePayEventsEnum`.

!::GooglePayEventsEnum::


## 📖 Reference
See the Stripe Documentation for more information. This plugin is wrapper, so there information seems useful for you.

### GooglePay(Android)
This plugin use GooglePayLauncher on `com.stripe:stripe-android`:

https://stripe.com/docs/google-pay
