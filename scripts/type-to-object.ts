import {DocsData, DocsInterfaceMethod, DocsMethodParam, TypeObject} from '../src/global/definitions';
import * as dataSource from '@capacitor-community/stripe/dist/docs.json';
import {formatDescription, formatType} from '@capacitor/docgen/dist/formatting';
import {MarkdownTable} from '@capacitor/docgen/dist/markdown';
import {DocsTagInfo} from '@capacitor/docgen';

const formatMethodSignature = (m: DocsInterfaceMethod): string =>  {
  if (m.name === 'addListener' && m.parameters.length > 0) {
    return `addListener(${m.parameters[0].type.replace(/\"/g, `'`)}, ...)`;
  }
  return `${m.name}(${m.parameters.length > 0 ? '...' : ''})`;
}

const createMethodParamTable = (data: DocsData, parameters: DocsMethodParam[]): string => {
  if (parameters.length === 0) {
    return '';
  }

  const t = new MarkdownTable();

  t.addHeader([`Param`, `Type`, `Description`]);

  parameters.forEach((p) => {
    const nm = `**\`${p.name}\`**`;
    const ty = formatType(data, p.type);
    const docs = formatDescription(data, p.docs);
    t.addRow([nm, ty.formatted, docs]);
  });

  t.removeEmptyColumns();

  return codeToMarkdown(t.toMarkdown().join('\n'));
}

const getTagText = (tags: DocsTagInfo[], tagName: string): string =>  {
  if (tags) {
    const tag = tags.find((t) => t.name === tagName && typeof t.text === 'string');
    if (tag) {
      return tag.text!;
    }
  }
  return '';
}

const codeToMarkdown = (text: string) => {
  return text
    .replace(/\<\/?code\>/g, `\``)
    .replace(/\<("[^"]*"|'[^']*'|[^'">])*>/g, '');
}

const createMarkdown = (sources: TypeObject[], type: string) => {
  return sources.map(data => {
    return Object.assign(data, {
      markdown: `### \`${type}\` ${data.param}\n${
        data.description ? data.description + '\n': ''
      }${
        data.type ? data.type  + '\n' : ''
      }${
        data.usage ? '`' + data.usage + '`'  + '\n' : ''
      }`
    });
  })
}

export const getTypeToObjects = (): Record<'methods' | 'interfaces' | 'typeAliases' | 'enums', TypeObject[]> => {
  const source = dataSource as DocsData;

  const methods: TypeObject[] = source!.api!.methods.map((m: DocsInterfaceMethod): TypeObject => {
    return {
      id: m.name,
      param: formatMethodSignature(m),
      // type: createMethodParamTable(source, m.parameters),
      type: '',
      description: formatDescription(source, m.docs),
      usage: `${m.name}${m.signature}`,
    };
  });

  const interfaces: TypeObject[] = source.interfaces.map((i): TypeObject  => {
    return {
      id: i.name,
      param: i.name,
      type: (() => {
        if (i.properties.length === 0) {
          return '';
        }
        const t = new MarkdownTable();

        t.addHeader([`Prop`, `Type`, `Description`, `Default`, `Since`]);

        i.properties.forEach((m) => {
          const defaultValue = getTagText(m.tags, 'default');

          t.addRow([
            `**\`${m.name}\`**`,
            formatType(source, m.type).formatted,
            formatDescription(source, m.docs),
            defaultValue ? `<code>${defaultValue}</code>` : '',
            getTagText(m.tags, 'since'),
          ]);
        });

        t.removeEmptyColumns();
        return codeToMarkdown(t.toMarkdown().join('\n'));
      })(),
      description: formatDescription(source, i.docs),
    };
  });

  const typeAliases: TypeObject[] = source.typeAliases.map((t): TypeObject => {
    return {
      id: t.name,
      param: t.name,
      type: codeToMarkdown(t.types
        .map((ty) => formatType(source, ty.text).formatted)
        .join(' | ')
        .replace(/\<\/code\> \| \<code\>/g, ` | `)),
      description: formatDescription(source, t.docs),
    };
  });

  const enums: TypeObject[] = source.enums.map((i): TypeObject => {
    return {
      id: i.name,
      param: i.name,
      type: (() => {
        if (i.members.length === 0) {
          return '';
        }
        const t = new MarkdownTable();

        t.addHeader([`Members`, `Value`, `Description`, `Since`]);

        i.members.forEach((m) => {
          t.addRow([
            `**\`${m.name}\`**`,
            formatType(source, m.value).formatted.replace(/(\<\/code\> \| \<code\>)/g, `\``),
            formatDescription(source, m.docs),
            getTagText(m.tags, 'since'),
          ]);
        });

        t.removeEmptyColumns();
        return codeToMarkdown(t.toMarkdown().join('\n'));
      })(),
    };
  });

  return {
    methods: createMarkdown(methods, 'method'),
    interfaces: createMarkdown(interfaces, 'interface'),
    typeAliases: createMarkdown(typeAliases, 'type alias'),
    enums: createMarkdown(enums, 'enum'),
  }
}
