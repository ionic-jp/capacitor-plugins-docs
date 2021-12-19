import { newSpecPage } from '@stencil/core/testing';
import { AppMenu } from '../app-menu';

describe('app-menu', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppMenu],
      html: `<app-menu></app-menu>`,
    });
    expect(page.root).toEqualHtml(`
      <app-menu>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </app-menu>
    `);
  });
});
