import { newSpecPage } from '@stencil/core/testing';
import { AppParser } from '../app-parser';

describe('app-parser', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppParser],
      html: `<app-parser></app-parser>`,
    });
    expect(page.root).toEqualHtml(`
      <app-parser>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </app-parser>
    `);
  });
});
