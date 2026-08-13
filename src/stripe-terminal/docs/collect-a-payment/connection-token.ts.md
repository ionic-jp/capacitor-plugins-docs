```ts:connection-token.ts
import { StripeTerminal, TerminalEventsEnum } from '@capacitor-community/stripe-terminal';

await StripeTerminal.addListener(
  TerminalEventsEnum.RequestedConnectionToken,
  async () => {
    try {
      const response = await fetch('https://example.com/connection/token', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`Connection token request failed: ${response.status}`);
      const data = (await response.json()) as { secret?: unknown };
      if (typeof data.secret !== 'string' || !data.secret) {
        throw new Error('Connection token response is missing secret');
      }
      await StripeTerminal.setConnectionToken({ token: data.secret });
    } catch (error) {
      // An empty token fails the pending native callback instead of leaving it hanging.
      try {
        await StripeTerminal.setConnectionToken({ token: '' });
      } finally {
        console.error('Unable to supply a connection token', error);
      }
    }
  },
);

await StripeTerminal.initialize({
  isTest: true,
});
```
