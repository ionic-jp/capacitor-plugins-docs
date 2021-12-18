import { newSpecPage } from '@stencil/core/testing';
import { AppScroll } from '../app-scroll';

describe('app-scroll', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppScroll],
      html: `<app-scroll></app-scroll>`,
    });
    expect(page.root).toEqualHtml(`
      <app-scroll>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </app-scroll>
    `);
  });
});
