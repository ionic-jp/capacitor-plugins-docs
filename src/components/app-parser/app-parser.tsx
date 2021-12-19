import {Component, Host, h, Prop, Element, Event, EventEmitter} from '@stencil/core';
import {MarkdownContent} from '../../global/definitions';
import { Build } from '@stencil/core';

@Component({
  tag: 'app-parser',
  styleUrls: ['app-parser.scss'],
  shadow: true,
})
export class AppParser {
  @Element() el: HTMLElement;
  @Prop() markdownContent: MarkdownContent;
  @Event({
    eventName: 'changedActiveLine',
  }) changedActiveLine: EventEmitter<Record<string, number[]>>;

  componentDidLoad() {
    if (this.markdownContent.scrollActiveLine?.length > 0) {
      const options = {
        // root: document.querySelector('.root'),
        rootMargin: "100px 20px",
        threshold: [0, 0.5, 1.0]
      };
      const callback = (entries, _) =>  {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const { activeLine } = this.markdownContent.scrollActiveLine.find(item => {
            return item.id.toLowerCase().replace(' ', '-') === entries[0].target.id;
          })
          if (activeLine) {
            this.changedActiveLine.emit(activeLine);
          }

          // 監視の解除
          // object.unobserve(img);
        });
      };

      this.markdownContent.scrollActiveLine.map(item => {
        if (!item.id) {
          return;
        }
        if (Build.isBrowser) {
          const target = this.el.shadowRoot.getElementById(item.id.toLowerCase().replace(' ', '-'));
          if (target) {
            const observer = new IntersectionObserver(callback, options);
            observer.observe(target);
          }
        }
      });

    }
  }

  render() {
    return (
      <Host>
        <div class="znc">
          <h1 innerHTML={this.markdownContent.title}></h1>
          <div innerHTML={this.markdownContent.hypertext}></div>
        </div>
      </Host>
    );
  }

}
