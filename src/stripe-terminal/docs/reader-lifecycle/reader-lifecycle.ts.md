```ts:reader-lifecycle.ts
import { StripeTerminal, TerminalEventsEnum } from '@capacitor-community/stripe-terminal';

await StripeTerminal.addListener(
  TerminalEventsEnum.ReportAvailableUpdate,
  async ({ update }) => {
    if (window.confirm('Will you update the device?')) {
      await StripeTerminal.installAvailableUpdate();
    }
  },
);

await StripeTerminal.addListener(
  TerminalEventsEnum.StartInstallingUpdate,
  async ({ update }) => {
    console.log(update);
    if (window.confirm('Will you interrupt the update?')) {
      await StripeTerminal.cancelInstallUpdate();
    }
  },
);

await StripeTerminal.addListener(
  TerminalEventsEnum.ReaderSoftwareUpdateProgress,
  async ({ progress }) => {
    console.log(progress);
  },
);

await StripeTerminal.addListener(
  TerminalEventsEnum.FinishInstallingUpdate,
  async (args) => {
    console.log(args);
  },
);

await StripeTerminal.addListener(
  TerminalEventsEnum.BatteryLevel,
  async ({ level, charging, status }) => {
    console.log(level, charging, status);
  },
);

await StripeTerminal.addListener(
  TerminalEventsEnum.ReaderEvent,
  async ({ event }) => {
    console.log(event);
  },
);

await StripeTerminal.addListener(
  TerminalEventsEnum.RequestDisplayMessage,
  async ({ messageType, message }) => {
    console.log(messageType, message);
  },
);

await StripeTerminal.addListener(
  TerminalEventsEnum.RequestReaderInput,
  async ({ options, message }) => {
    console.log(options, message);
  },
);

await StripeTerminal.setReaderDisplay({
  currency: 'usd',
  tax: 0,
  total: 1000,
  lineItems: [
    {
      displayName: 'winecode',
      quantity: 2,
      amount: 500,
    },
  ],
});

await StripeTerminal.clearReaderDisplay();

await StripeTerminal.cancelDiscoverReaders();

await StripeTerminal.addListener(
  TerminalEventsEnum.UnexpectedReaderDisconnect,
  async ({ reader }) => {
    console.log(reader);
  },
);

await StripeTerminal.addListener(
  TerminalEventsEnum.ReaderReconnectStarted,
  async ({ reader, reason }) => {
    console.log(reader, reason);
  },
);

await StripeTerminal.addListener(
  TerminalEventsEnum.ReaderReconnectSucceeded,
  async ({ reader }) => {
    console.log(reader);
  },
);

await StripeTerminal.addListener(
  TerminalEventsEnum.ReaderReconnectFailed,
  async ({ reader }) => {
    console.log(reader);
  },
);

await StripeTerminal.cancelReaderReconnection();

await StripeTerminal.rebootReader();

await StripeTerminal.addListener(
  TerminalEventsEnum.Failed,
  (info) => {
    console.log(info.message, info.code, info.declineCode);
  },
);
```
