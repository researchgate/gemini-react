# gemini-react

[gemini](https://github.com/gemini-testing/gemini) plugin for simplifying visual
regression testing on React + webpack stack.

**WARNING**: Right now plugin is pretty much at the proof-of-concept stage, do
not use in production.

## Configuring

1. Install plugin using `npm`:

   ```
   npm install gemini-react
   ```

2. Enable it in your gemini config file:

```yaml
system:
  plugins:
    react:
      webpackConfig: <PATH>
      hostname: <HOST NAME>
      port: <PORT NUMBER>
```

### Options

* `webpackConfig` (required) – path to your webpack config. Plugin will use
  loaders from this file to build test pages.
* `listenHost` (default: 127.0.0.1) - hostname to run reference test server on.
* `publicHost`: (default: equal to `listenHost`) - hostname to direct selenium
  browsers to.
* `port` (default: 5432) - port to run test server on.
* `staticRoot` - directory, which contains your static asset files. Will be
mounted by your test server automatically.
* `cssFiles` - list of CSS files to include in every test page. Requires
  `staticRoot` option to be set.
* `jsModules` - list of additional js modules to include in the test pages.
  Relative to project root. This modules will be included into your client
  bundle before the rest files.
* `customizeServer` - path to js file, used to customize the express server.
  The file should have a single export, which is function of `(app, express)`.

  Example:

  ```js
  module.exports = function(app, express) {
    app.use(function myMiddleware(req, res, next) {
        ...
    });
  }
  ```

## Writing the tests

Use `geminiReact` variable instead of `gemini` and `render(<ReactComponent />)`
instead of `setUrl` and `setCaptureElements`. The rest is the same as vanilla
`gemini`:

```jsx
const MyComponent = require('./path/to/my/component');
geminiReact.suite('my react test', suite => {
    suite.render(<MyComponent prop="value" />)
        .capture('initial');
});
```

**TIP**: To use JSX in your tests, you might need [gemini-babel](https://github.com/researchgate/gemini-babel) plugin.

You don't need to create the reference pages or run the server, plugin will do
everything for you.

If you want to interact with rendered component, use `this.renderedComponent`
inside your test:

```javascript
suite.capture('clicked', function(actions) {
    actions.click(this.renderedComponent);
});
```

If you have any test-specific stylesheets, you can include them into the test
page by calling `suite.includeCss`:

```javscript
suite.includeCss('/my-component.css');
```

By default, `geminiReact` will capture rendered at mounting point element.
If you want to add some extra elements, use `setExtraCaptureElements`:

```javascript
suite.setExtraCaptureElements(['.popup']);
```
