---
title: "Google Pay"
code: ["/docs/stripe/google-pay/strings.xml.md", "/docs/stripe/google-pay/android-manifest.xml.md", "/docs/stripe/google-pay/google-pay.ts.md"]
scrollActiveLine: []
---

With Google Pay, you can make instant payments in a single flow. Please check settings: https://stripe.com/docs/google-pay
And in Android App, you need some settings.

In file android/app/src/main/res/values/strings.xml add the following lines :
```xml
<string name="publishable_key">Your Publishable Key</string>
<bool name="enable_google_pay">true</bool>
<string name="country_code">US</string>
<string name="merchant_display_name">Widget Store</string>
<bool name="google_pay_is_testing">true</bool>
```

In file android/app/src/main/AndroidManifest.xml, add the following XML elements under <manifest><application> :
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

## 1. createGooglePay

You should connect to your backend endpoint, and get every key. This is "not" function at this Plugin. So you can use `HTTPClient` , `Axios` , `Ajax` , and so on.
Backend structure is here: https://stripe.com/docs/payments/accept-a-payment?platform=android#add-server-endpoint

```ts
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';

export async function createGooglePay(): Promise<void> {
  /**
   * Connect to your backend endpoint, and get every key.
   */
  const { paymentIntent } = await this.http.post<{
    paymentIntent: string;
  }>(environment.api + 'payment-sheet', {}).pipe(first()).toPromise(Promise);

  await Stripe.createGooglePay({
    paymentIntentClientSecret: paymentIntent,
  });
}
```

## 2. presentGooglePay

present in `createGooglePay` is single flow. You don't need to confirm method.

```ts
export async function present(): Promise<void> {
  const result = await Stripe.presentApplePay();
}
```