# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.10.2"></a>
## [0.10.2](https://github.com/researchgate/gemini-react/compare/v0.10.1...v0.10.2) (2016-11-15)


### Bug Fixes

* remove display: inline-block from mount node ([35bf226](https://github.com/researchgate/gemini-react/commit/35bf226))



<a name="0.10.1"></a>
## [0.10.1](https://github.com/researchgate/gemini-react/compare/v0.10.0...v0.10.1) (2016-11-15)


### Bug Fixes

* crash in lazy mode ([4a7b36d](https://github.com/researchgate/gemini-react/commit/4a7b36d))



<a name="0.10.0"></a>
# [0.10.0](https://github.com/researchgate/gemini-react/compare/v0.9.0...v0.10.0)
(2016-11-11)


### Bug Fixes

* use webpack config from options completely ([b733188](https://github.com/researchgate/gemini-react/commit/b733188))
* **deps:** remove unnecessary dependencies ([10f7020](https://github.com/researchgate/gemini-react/commit/10f7020))


### BREAKING CHANGES

* `webpackLazyMode` option is now incompatible with webpack plugins,
which split one chunk into multiple. Either switch it off or exclude
such plugins from your config from gemini tests.



<a name="0.9.0"></a>
# [0.9.0](https://github.com/researchgate/gemini-react/compare/v0.8.0...v0.9.0)
(2016-10-18)


### Features

* Add `replaceRootUrl` option ([da55f54](https://github.com/researchgate/gemini-react/commit/da55f54))


### BREAKING CHANGES

* `publicHost` option is removed. If you need `rootUrl`
to have different value, set `replaceRootUrl` option to `false` and
manually set `rootUrl`.



<a name="0.8.0"></a>
# [0.8.0](https://github.com/researchgate/gemini-react/compare/v0.7.2...v0.8.0) (2016-10-17)


### Features

* **webpack:** add `webpackLazyMode` option ([6ff0e25](https://github.com/researchgate/gemini-react/commit/6ff0e25))



<a name="0.7.2"></a>
## [0.7.2](https://github.com/researchgate/gemini-react/compare/v0.7.1...v0.7.2) (2016-10-14)


### Bug Fixes

* Ignore styles in node environment ([#20](https://github.com/researchgate/gemini-react/issues/20)) ([e080953](https://github.com/researchgate/gemini-react/commit/e080953))
