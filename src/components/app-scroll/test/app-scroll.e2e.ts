import { newE2EPage } from '@stencil/core/testing';

describe('app-scroll', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-scroll></app-scroll>');

    const element = await page.find('app-scroll');
    expect(element).toHaveClass('hydrated');
  });
});
