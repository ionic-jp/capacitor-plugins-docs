---
title: Getting Started
code: []
scrollActiveLine: []
---

## Overview

## What is this?

This library is used to uniquely group the ionIcons in a project, and generate for export ionIcons file. In small projects, it is difficult to manage `addIcons()` of ionIcons each time, so we automated it.

- development: Stress-free development by add all icons at `addIcons`.
- Production: Automatically collect and update the ionIcon used in the template prior to build.

Of course, to maximize bundle size reduction, it is important to load a minimum number of icons at each Component lazy loading. This is a compromise to speed up development.

This project is based [ionic-team/ionic-angular-standalone-codemods](https://github.com/ionic-team/ionic-angular-standalone-codemods) .

## Requirements

- Node.js >= 20
- ionicons >= 6.0.0


## Quick start

After [Installation](#installation), initialize `addIcons` and collect icons before production builds:

```bash
npx @rdlabo/ionic-angular-collect-icons --initialize true
```

Details: [Initialize](/docs/initialize) and [Usage](/docs/usage).

## Installation

```bash
npm install @rdlabo/ionic-angular-collect-icons --save-dev
```

## Documentation

Start with [Installation](#installation), then [Initialize](/docs/initialize) and [Usage](/docs/usage).

- [Initialize](/docs/initialize) — wire `addIcons` automatically or by hand.
- [Usage](/docs/usage) — run the collector before production builds.
- [CLI Options](/docs/options) — `--dry-run`, `--initialize`, paths.
- [FAQ](/docs/faq) — tests, binding, and `main.ts`.
