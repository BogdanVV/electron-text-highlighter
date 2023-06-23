## Where am I?

It's an application where you can browse different web-sites within standalone app and save the text you highlight inside your machine/PC/laptop/whatever.

## Why Vite instead of CRA?

Because Vite is faster than CRA with webpack. Besides, CRA is considered to be dead since the beginning of 2023 :)

## Why I didn't use any css preprocessors/libs like scss/tailwind/styled-components?

Because styling isn't the thing in this particular case since esentially it consists of a few components. CSS-modules will do.

## How to run this project locally?

### Prerequisites:

- [nvm for iOS/Linux](https://github.com/nvm-sh/nvm) or [nvm for Windows](https://github.com/coreybutler/nvm-windows)
- `Node` of version [18.16.1](https://nodejs.org/dist/v18.16.1/node-v18.16.1.pkg)

### Commands:

- for running the project locally:

```bash
npm i
npm run dev
```

- for build:

```bash
npm run build
```

after build you can find binary file in `/release` folder (not sure what directory's gonna be displayed on your PC inside `release` folder, because it depends on your OS. E.g. for MacOS Silicon it's `/release/0.0.0/mac-arm64/text-highlighter.app/Contents/MacOS/text-highlighter`)
