---
title: "Google Pay"
code: [
  "/docs/stripe/google-pay/strings.xml.md",
  "/docs/stripe/google-pay/android-manifest.xml.md",
  "/docs/stripe/google-pay/google-pay.ts.md"
]
scrollActiveLine: [
  {id: "", activeLine: {}},
  {id: "strings.xml", activeLine: {['strings.xml']: [6, 16]}},
  {id: "androidmanifest.xml", activeLine: {['AndroidManifest.xml']: [17, 40]}},
  {id: "1.-isgooglepayavailable", activeLine: {['google-pay.ts']: [3, 8]}},
  {id: "2.-creategooglepay", activeLine: {['google-pay.ts']: [10, 27]}},
  {id: "3.-presentgooglepay", activeLine: {['google-pay.ts']: [27, 33]}},
  {id: "4.-addlistener", activeLine: {['google-pay.ts']: [8, 10]}}
]
---

With Google Pay, you can make instant payments in a single flow. Please check settings:

https://stripe.com/docs/google-pay

And if you will work on the web, you should check "Payment Request Button" 's docs. __Serve your application over HTTPS. This is a requirement both in development and in production. One way to get up and running is to use a service like ngrok.__

https://stripe.com/docs/stripe-js/elements/payment-request-button?platform=html-js-testing-google-pay#html-js-prerequisites

## 🐾 Implements Guide

### Prepare settings
For using Google Pay, you need some settings.

#### strings.xml

In file `android/app/src/main/res/values/strings.xml` add the these value.

- publishable_key(Stripe's publoshable key)
- enable_google_pay
- country_code
- merchant_display_name
- google_pay_is_testing

These settings are used because Google Pay requires some processing to be done before initializing the plugin.

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

#### Optional1: If you get user information, set these:

Added metadata options to specify what, if any, billing info to require from Google Pay. Add the following entries to strings.xml in the Android project to enable additional data:

In file `android/app/src/main/res/values/strings.xml` add the these value.

```xml
<bool name="email_address_required">true</bool>
<bool name="phone_number_required">true</bool>
<bool name="billing_address_required">true</bool>
<string name="billing_address_format">Full</string>
```

And in file `android/app/src/main/AndroidManifest.xml`, add the following XML elements under `manifest > application`.

```xml
<meta-data
  android:name="com.getcapacitor.community.stripe.email_address_required"
  android:value="@bool/email_address_required"/>

<meta-data
android:name="com.getcapacitor.community.stripe.phone_number_required"
android:value="@bool/phone_number_required"/>

<meta-data
android:name="com.getcapacitor.community.stripe.billing_address_required"
android:value="@bool/billing_address_required"/>

<meta-data
android:name="com.getcapacitor.community.stripe.billing_address_format"
android:value="@string/billing_address_format"/>
```

#### Optional2: If you don't require existing payment method at Googl Pay:

If false, Google Pay is considered ready if the customer's Google Pay wallet does "not" have existing payment methods.
Default to true.

In file `android/app/src/main/res/values/strings.xml` add the these value.

```xml
<bool name="google_pay_existing_payment_method_required">false</bool>
```

And in file `android/app/src/main/AndroidManifest.xml`, add the following XML elements under `manifest > application`.

```xml
<meta-data
    android:name="com.getcapacitor.community.stripe.google_pay_existing_payment_method_required"
    android:value="@bool/google_pay_existing_payment_method_required"/>
```

### 1. isGooglePayAvailable
First, you should check to be able to use Google Pay on device. 

```ts
import { Stripe, GooglePayEventsEnum } from '@capacitor-community/stripe';

(async () => {
  // Check to be able to use Google Pay on device
  const isAvailable = Stripe.isGooglePayAvailable().catch(() => undefined);
  if (isAvailable === undefined) {
    // disable to use Google Pay
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

  // Prepare Google Pay
  await Stripe.createGooglePay({
    paymentIntentClientSecret: paymentIntent,

    // Web only. Google Pay on Android App doesn't need
    paymentSummaryItems: [{
      label: 'Product Name',
      amount: 1099.00
    }],
    merchantIdentifier: 'merchant.com.getcapacitor.stripe',
    countryCode: 'US',
    currency: 'USD',
  });
})();
```

!::createGooglePay::

You can use options of `CreateGooglePayOption` on `createGooglePay`. 

!::CreateGooglePayOption::

:::message
`paymentSummaryItems`, `merchantIdentifier`, `countryCode`, `currency` is needed on the web only. If you will implement Google Pay on Android App only, don't need.
:::

### 3. presentGooglePay

present in `createGooglePay` is single flow. You don't need to confirm method.

```ts
(async () => {
  // Present Google Pay
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

Method of Google Pay notify any listeners. If you want to get event of payment process is 'Completed', you should add `GooglePayEventsEnum.Completed` listener to `Stripe` object:

```ts
// be able to get event of Google Pay
Stripe.addListener(GooglePayEventsEnum.Completed, () => {
  console.log('GooglePayEventsEnum.Completed');
});
```

The event name you can use is `GooglePayEventsEnum`.

!::GooglePayEventsEnum::


## 📖 Reference
See the Stripe Documentation for more information. This plugin is wrapper, so there information seems useful for you.

### Google Pay (Android)
This plugin use GooglePayLauncher on `com.stripe:stripe-android`:

https://stripe.com/docs/google-pay

### Google Pay (Web)
This plugin use "Payment Request Button". 

https://stripe.com/docs/stripe-js/elements/payment-request-button?platform=html-js-testing-google-pay#html-js-prerequisites