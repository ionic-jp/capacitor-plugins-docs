import { newE2EPage } from '@stencil/core/testing';

describe('app-parser', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-parser></app-parser>');

    const element = await page.find('app-parser');
    expect(element).toHaveClass('hydrated');
  });
});
