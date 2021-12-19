import { newE2EPage } from '@stencil/core/testing';

describe('app-docs', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-docs></app-docs>');

    const element = await page.find('app-docs');
    expect(element).toHaveClass('hydrated');
  });
});
