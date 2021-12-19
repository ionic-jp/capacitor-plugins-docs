import { newE2EPage } from '@stencil/core/testing';

describe('app-menu', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-menu></app-menu>');

    const element = await page.find('app-menu');
    expect(element).toHaveClass('hydrated');
  });
});
