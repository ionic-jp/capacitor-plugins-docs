import { newSpecPage } from '@stencil/core/testing';
import { AppCodes } from '../app-codes';

describe('app-codes', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppCodes],
      html: `<app-codes></app-codes>`,
    });
    expect(page.root).toEqualHtml(`
      <app-codes>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </app-codes>
    `);
  });
});
