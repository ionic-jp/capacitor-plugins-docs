# Capacitor-plugins-docs
This repository is for create document of Capacitor Plugin.

## How to create docs
This is example of [first step of adding new plugin](https://github.com/rdlabo-team/capacitor-plugins-docs/commit/c67758326bca456305b36a91da8b10755b84e35c):

### 1. Add docs.json to plugin's package
Your plugin may use `@capacitor/docgen`. You should add `--output-json dist/docs.json` to docgen script. example:

```bash
% docgen --api [YOUR TYPE NAME] --output-readme README.md --output-json dist/docs.json
```

### 2. Fork this repository
Fork this repository. If you want, you can create a documentation for your plugin and make a pull request. Of course, you can also operate the forked repository yourself.

### 3. Add docs

#### 3.1. Install plugin to this repository

Case of `@capacitor-community/facebook` plugin:

```bash
% npm install @capacitor-community/facebook --save-dev
```

#### 3.2. Add your plugin to `docs/package.json`

Case of `@capacitor-community/facebook` plugin, you should add lines:

```json
{
  "stripe": {
    "name": "capacitor-community/stripe",
    "repository": "https://github.com/rdlabo-team/capacitor-plugins-docs/"
  },
  "facebook": {
    "name": "capacitor-community/facebook",
    "repository": "https://github.com/rdlabo-team/capacitor-plugins-docs/"
  }
}
```

- "facebook" is only alias. Use a name that is not already in use.
- "name" is package name of npm.
- "repository" is document repository. default is "https://github.com/rdlabo-team/capacitor-plugins-docs/". If you want to use own repository, you should change.

#### 3.3. Copy `docs/.template` folder to alias folder.

You should run `cp -r src/docs/.template src/docs/your-alias`. Case of `@capacitor-community/facebook` plugin:

```bash
% cp -r src/docs/.template src/docs/facebook
```

And change "app-template" to "app-[Your Alias]". All: folder name, file name, component tag. 

#### 3.4. Ready!

All that's left is to write the documentation with the help of other plugins.

## Getting Started

run:

```bash
npm start -- --plugin=stripe
```

To build the app for production, run:

```bash
npm run build -- --plugin=stripe
```

update docs:

```bash
npm run docs
```

## Markdown Notation

This markdown use [Zenn Editor](https://github.com/zenn-dev/zenn-editor). So you can use zenn's markdown notation. List is here:

https://zenn.dev/zenn/articles/markdown-guide

And added custom notation of add types. If your plugin has `createPaymentSheet` interface, you can:

```md
!::createPaymentSheet::
```

This will paste the type information of createPaymentSheet.
