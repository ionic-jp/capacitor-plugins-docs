---
title: "Event Listeners"
code: []
scrollActiveLine: []
---

This document provides detailed information about all event listeners available in the `@capacitor-community/stripe` plugin.

## Basic Usage of Event Listeners

### Initialization and Import

```typescript
import { 
  Stripe, 
  PaymentSheetEventsEnum,
  PaymentFlowEventsEnum,
  ApplePayEventsEnum,
  GooglePayEventsEnum 
} from '@capacitor-community/stripe';
```

### When to Register Event Listeners

For React:
```typescript
useEffect(() => {
  // Register listeners
  const listeners = [
    await Stripe.addListener(PaymentSheetEventsEnum.Loaded, () => {
      // Handler
    }),
    // Other listeners...
  ];

  // Cleanup
  return () => {
    listeners.forEach(listener => listener.remove());
  };
}, []);
```

For Angular:
```typescript
ngOnInit() {
  // Register listeners
  this.listeners = [
    await Stripe.addListener(PaymentSheetEventsEnum.Loaded, () => {
      // Handler
    }),
    // Other listeners...
  ];
}

ngOnDestroy() {
  // Cleanup
  this.listeners.forEach(listener => listener.remove());
}
```

## PaymentSheet Events

### 1. Loaded
Fires when the PaymentSheet has finished loading.

```typescript
Stripe.addListener(PaymentSheetEventsEnum.Loaded, () => {
  // PaymentSheet is ready
  // At this point, you can call presentPaymentSheet()
  setIsReady(true);
});
```

### 2. FailedToLoad
Fires when the PaymentSheet fails to load.

```typescript
Stripe.addListener(PaymentSheetEventsEnum.FailedToLoad, (error: string) => {
  console.error('Failed to load PaymentSheet:', error);
  // Display error message or handle the error
  showErrorToast(error);
});
```

### 3. Completed
Fires when the payment has been successfully completed.

```typescript
Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
  // Post-payment processing
  // - Confirm the order
  // - Navigate to completion screen
  // - Trigger confirmation email, etc.
  completeOrder();
  navigateToSuccessPage();
});
```

### 4. Canceled
Fires when the user cancels the payment.

```typescript
Stripe.addListener(PaymentSheetEventsEnum.Canceled, () => {
  // Handle cancellation
  // - Reset UI to initial state
  // - Provide feedback to the user
  resetPaymentUI();
  showCancelMessage();
});
```

### 5. Failed
Fires when an error occurs during the payment process.

```typescript
Stripe.addListener(PaymentSheetEventsEnum.Failed, (error: string) => {
  // Error handling
  // - Display error message
  // - Offer retry options
  // - Suggest alternative payment methods
  handlePaymentError(error);
  showRetryOption();
});
```

## PaymentFlow Events

### 1. Loaded
Fires when the PaymentFlow has finished loading.

```typescript
Stripe.addListener(PaymentFlowEventsEnum.Loaded, () => {
  // PaymentFlow is ready
  // Update UI or hide loading indicators
  setPaymentFlowReady(true);
  hideLoading();
});
```

### 2. FailedToLoad
Fires when the PaymentFlow fails to load.

```typescript
Stripe.addListener(PaymentFlowEventsEnum.FailedToLoad, (error: string) => {
  // Handle loading errors
  handleLoadError(error);
});
```

### 3. Opened
Fires when the PaymentFlow is opened.

```typescript
Stripe.addListener(PaymentFlowEventsEnum.Opened, () => {
  // Post-opening processing
  // - Send analytics events
  // - Manage UI state
  trackPaymentFlowOpened();
  updateUIState('payment_flow_opened');
});
```

### 4. Created
Fires when card information is created. This event is particularly important as it includes the card number information.

```typescript
Stripe.addListener(PaymentFlowEventsEnum.Created, (info: { cardNumber: string }) => {
  // Post-card-creation processing
  // - Enable confirmation button
  // - Display card information (last 4 digits only)
  setCanConfirm(true);
  displayLastFourDigits(info.cardNumber);
});
```

### 5. Completed
Fires when the payment through PaymentFlow is completed.

```typescript
Stripe.addListener(PaymentFlowEventsEnum.Completed, () => {
  // Post-payment processing
  completePaymentFlow();
  showSuccessMessage();
});
```

### 6. Canceled
Fires when the user cancels the PaymentFlow.

```typescript
Stripe.addListener(PaymentFlowEventsEnum.Canceled, () => {
  // Handle cancellation
  resetPaymentFlowState();
  showCancelFeedback();
});
```

### 7. Failed
Fires when an error occurs in the PaymentFlow.

```typescript
Stripe.addListener(PaymentFlowEventsEnum.Failed, (error: string) => {
  // Error handling
  handlePaymentFlowError(error);
  offerAlternativePayment();
});
```

## Event Flow

Typical PaymentSheet process flow:

1. Call `createPaymentSheet()`
2. Wait for the `Loaded` event
3. Call `presentPaymentSheet()`
4. Receive one of the following events:
   - `Completed`: Payment successful
   - `Canceled`: User canceled
   - `Failed`: Error occurred

PaymentFlow process flow:

1. Call `createPaymentFlow()`
2. Wait for the `Loaded` event
3. Call `presentPaymentFlow()`
4. Receive the `Opened` event
5. Card information entry
6. Receive the `Created` event (with card information)
7. Call `confirmPaymentFlow()`
8. Receive one of the following events:
   - `Completed`: Payment successful
   - `Canceled`: User canceled
   - `Failed`: Error occurred

## Important Notes

1. Event listeners operate asynchronously.
2. You can add multiple listeners for the same event, but manage them properly to prevent memory leaks.
3. For error events, log error messages appropriately and display them to users when necessary.
4. PaymentSheet and PaymentFlow have different event sets, so choose the appropriate events based on the API you're using.
5. Integrate event listeners properly with your application's state management (Redux, NgRx, Vuex, etc.).
6. In production environments, remove debug console logs or set them to appropriate log levels.
