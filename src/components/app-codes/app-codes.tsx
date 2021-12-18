import {Component, Host, h, Prop, State, Watch} from '@stencil/core';

@Component({
  tag: 'app-codes',
  styleUrl: 'app-codes.scss',
  shadow: true,
})
export class AppCodes {
  @Prop() codes: Record<string, string> = {};
  @Prop() activeLine: Record<string, number[]> = {}
  @State() activeTab: string;
  renderCodes: Record<string, string> = {};

  componentWillLoad() {
    this.activeTab = Object.keys(this.codes)[0];
  }

  /**
   * codesが変わるとリストが変更するため
   * @param newValue
   */
  @Watch('codes')
  changeCodes(newValue: string) {
    this.activeTab = Object.keys(newValue)[0];
  }

  private effectActiveLine() {
    if (Object.keys(this.activeLine).length === 0) {
      this.renderCodes = Object.assign({}, this.codes);
      return;
    }
    Object.keys(this.activeLine).forEach(fileName => {
      if (this.activeLine[fileName].length === 0) {
        return;
      }
      const doc = new DOMParser().parseFromString(this.codes[fileName], "text/html");
      const createNode = [];
      let i = 1;
      let line = '';
      const code: HTMLElement = doc.body;

      // @ts-ignore
      for(let node of code.querySelector('pre code').childNodes) {
        if (node.textContent.includes('\n')) {
          createNode.push(`<span class="line-${i} ${this.activeLine[fileName].includes(i) ? '' : 'disabled' }">` + line + '</span>');
          line = '';
          i++;
        }
        line += new XMLSerializer().serializeToString(node);
      }

      code.querySelector('pre code').innerHTML = createNode.join('').replace('xmlns="http://www.w3.org/1999/xhtml"', '');

      this.renderCodes = Object.assign({}, this.codes, {
        [fileName]: new XMLSerializer().serializeToString(code),
      });
    });
  }

  selectTab = (event) => {
    event.preventDefault();
    this.activeTab = event.path[0].innerText;
    console.log(this.activeTab);
  }

  render() {
    this.effectActiveLine();
    return (
      <Host>
        <div class="segment">
          {Object.keys(this.renderCodes).map(key =>
            <button onClick={this.selectTab} class={this.activeTab === key ? 'active': '' }>{key}</button>
          )}
        </div>
        <div class="znc">
          {Object.keys(this.renderCodes).map(key =>
            <div class={this.activeTab === key ? 'active': '' } innerHTML={this.renderCodes[key]}></div>
          )}
        </div>
      </Host>
    );
  }
}
