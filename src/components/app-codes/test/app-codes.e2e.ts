import { newE2EPage } from '@stencil/core/testing';

describe('app-codes', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-codes></app-codes>');

    const element = await page.find('app-codes');
    expect(element).toHaveClass('hydrated');
  });
});
