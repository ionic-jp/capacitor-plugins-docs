```ts:tap-to-pay.ts
import {
  StripeTerminal,
  TapToPayDarkMode,
  TerminalConnectTypes,
} from '@capacitor-community/stripe-terminal';
import { Capacitor } from '@capacitor/core';

// Register the authenticated RequestedConnectionToken provider first.
await StripeTerminal.initialize({ isTest: true });

if (Capacitor.getPlatform() === 'ios') {
  const { isLinked } = await StripeTerminal.isTapToPayAccountLinked();
  console.log(isLinked);
}

if (Capacitor.getPlatform() === 'android') {
  await StripeTerminal.setTapToPayUxConfiguration({
    colors: { primary: '#FF5733' },
    darkMode: TapToPayDarkMode.Light,
  });
}

const { readers } = await StripeTerminal.discoverReaders({
  type: TerminalConnectTypes.TapToPay,
  locationId: '**************',
});

const reader = readers[0];
if (!reader) throw new Error('Tap to Pay is not available on this device');

await StripeTerminal.connectReader({
  reader,
  autoReconnectOnUnexpectedDisconnect: true,
});
```
