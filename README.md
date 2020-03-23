# microcks.io

Public website for Microcks. Static result is pushed into microcks.github.io repository.

See live result on [Microcks.io](https://microcks.io) 😉

## Publishing site

Execute the `deploy.sh` script with write permission to both `github.com/microcks/microcks.io` and `github.com/microcks/microcks.github.io`.

## Microcks theme

Microcks theme for Hugo is located into `/themes/microcks` folder.

When changing something in the theme, you'll have to rebuild it using 

```
$ npm run build

> microcks.io-theme@1.0.0 build /Users/lbroudou/Development/github/microcks.io/themes/microcks
> NODE_ENV=production webpack

NODE_ENV:  production
clean-webpack-plugin: /Users/lbroudou/Development/github/microcks.io/themes/microcks/assets/output has been removed.
clean-webpack-plugin: /Users/lbroudou/Development/github/microcks.io/themes/microcks/assets/output has been removed.
ℹ ｢webpack｣: Starting Build
ℹ ｢webpack｣: Build Finished

webpack v4.41.2

498c7da7a4ac84928a9d
  size     name  module                       status
  358 B    1     ./assets/index.js            built
  39 B     2     ./assets/css/main.css        built
  1.26 kB  3     ./assets/js/anchorforid.js   built
  925 B    4     ./assets/js/clipboardjs.js   built
  325 B    6     ./assets/js/codeblocks.js    built
  256 B    7     ./assets/js/docsearch.js     built
  1.85 kB  9     ./assets/js/hljs.js          built
  190 B    20    ./assets/js/lazysizes.js     built
  1.4 kB   22    ./assets/js/menutoggle.js    built
  65 B     23    ./assets/js/scrolldir.js     built
  2.37 kB  25    ./assets/js/smoothscroll.js  built
  1.31 kB  26    ./assets/js/tabs.js          built
  100 B    27    ./assets/js/nojs.js          built

  size     name  asset                        status
  168 kB   app   css/app.css                  emitted
  165 kB   app   js/app.js                    emitted

  Δt 2905ms (16 modules hidden)


performance
  0:0  warning  The following entrypoint(s) combined asset size exceeds the recommended
                limit (244 KiB). This can impact web performance.
                Entrypoints:
                  app (325 KiB)
                    css/app.css
                    js/app.js
  0:0  warning  You can limit the size of your bundles by using import() or
                require.ensure to lazy load some parts of your application.

⚠  2 problems (0 errors, 2 warnings)
```