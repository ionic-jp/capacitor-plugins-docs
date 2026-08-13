```ts:collect-payment.ts
import {
  StripeTerminal,
  TerminalConnectTypes,
  TerminalEventsEnum,
} from '@capacitor-community/stripe-terminal';

const paymentStatusListener = await StripeTerminal.addListener(
  TerminalEventsEnum.PaymentStatusChange,
  ({ status }) => console.log(status),
);
const confirmedListener = await StripeTerminal.addListener(
  TerminalEventsEnum.ConfirmedPaymentIntent,
  () => console.log('Payment processed; waiting for the server webhook'),
);
const failedListener = await StripeTerminal.addListener(
  TerminalEventsEnum.Failed,
  (error) => console.error(error),
);

// Register the authenticated RequestedConnectionToken provider first.
await StripeTerminal.initialize({ isTest: true });

const { readers } = await StripeTerminal.discoverReaders({
  type: TerminalConnectTypes.TapToPay,
  locationId: '**************',
});

const reader = readers[0];
if (!reader) throw new Error('No compatible reader found');

await StripeTerminal.connectReader({
  reader,
});

try {
  const response = await fetch('https://example.com/connection/intent', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`PaymentIntent request failed: ${response.status}`);
  const { paymentIntent } = (await response.json()) as { paymentIntent: string };

  await StripeTerminal.collectPaymentMethod({ paymentIntent });
  await StripeTerminal.confirmPaymentIntent();
} finally {
  await StripeTerminal.disconnectReader();
}

// Remove the three listeners when their application-level owner is destroyed.
```
