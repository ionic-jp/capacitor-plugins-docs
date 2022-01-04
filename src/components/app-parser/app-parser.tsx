import { Component, Host, h, Prop, Element, Event, EventEmitter, State, Watch } from '@stencil/core';
import { MarkdownContent } from '../../global/definitions';
import { Build } from '@stencil/core';

@Component({
  tag: 'app-parser',
  styleUrls: ['app-parser.scss'],
  shadow: true,
})
export class AppParser {
  @Element() el: HTMLElement;
  @Prop() markdownContent: MarkdownContent;
  @Prop() hideCodeBlock: boolean;
  @State() _markdownContent: MarkdownContent;
  @Event({
    eventName: 'changedActiveLine',
  })
  changedActiveLine: EventEmitter<Record<string, number[]>>;
  private observers: IntersectionObserver[] = [];

  @Watch('markdownContent')
  async watchLabelHandler() {
    this._markdownContent = this.markdownContent;
  }

  componentDidRender() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.prepareIntersectionObserver();
  }

  prepareIntersectionObserver() {
    if (this.markdownContent.scrollActiveLine?.length > 0) {
      const options = {
        // root: document.querySelector('.root'),
        rootMargin: '0px 0px -70% 0px',
        threshold: 1.0,
      };
      const callback = (entries, _) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const { activeLine } = this.markdownContent.scrollActiveLine.find((item) => {
            return item.id.toLowerCase().replace(' ', '-') === entries[0].target.id;
          });
          if (activeLine) {
            this.changedActiveLine.emit(activeLine);
          }

          // 監視の解除
          // object.unobserve(img);
        });
      };

      const targets: HTMLElement[] = this.markdownContent.scrollActiveLine.map((item) => {
        if (Build.isBrowser) {
          return !item.id ? this.el.shadowRoot.querySelector('h1') : this.el.shadowRoot.getElementById(item.id.toLowerCase().replace(' ', '-'));
        }
      });

      this.observers = targets.map((target) => {
        const observer = new IntersectionObserver(callback, options);
        observer.observe(target);
        return observer;
      });
    }
  }

  render() {
    return (
      <Host>
        <div class={this.hideCodeBlock ? 'znc hideCodeBlock' : 'znc'}>
          <h1 innerHTML={this.markdownContent.title}></h1>
          <div innerHTML={this.markdownContent.hypertext}></div>
        </div>
      </Host>
    );
  }
}
