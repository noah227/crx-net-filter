# crx-net-filter

## Setup

```shell
npm install
```

## Build

```shell
npm run build
```

or

```shell
npm run build-watch
```

## Install

* visit extension management page `chrome://extensions/`(Chrome) | `edge://extensions/`(Edge)
* enable `developer mode`
* drag `dist` into extension page
* enjoy!

## Reminding

* Files in dist like chunk-vendors, chunk-common, etc. may need to be included in manifest.json to ensure extension to
  work as that it should be

## Official Extension Development Docs (Google)

* [get-started](https://developer.chrome.com/docs/extensions/get-started) (worldwide)
* [get-started](https://developer.chrome.google.cn/docs/extensions/get-started/tutorial/hello-world?hl=zh-cn) (中文)
