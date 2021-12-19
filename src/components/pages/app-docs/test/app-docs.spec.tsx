import { newSpecPage } from '@stencil/core/testing';
import { AppDocs } from '../app-docs';

describe('app-docs', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppDocs],
      html: `<app-docs></app-docs>`,
    });
    expect(page.root).toEqualHtml(`
      <app-docs>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </app-docs>
    `);
  });
});
