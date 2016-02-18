<a name="1.1.0-alpha"></a>
# [1.1.0-alpha](https://github.com/zalando/dress-code/compare/1.0.1-alpha...v1.1.0-alpha) (2016-02-18)


### Bug Fixes

* **demo:** Fix typo in demo ([c00dd59](https://github.com/zalando/dress-code/commit/c00dd59))
* **dialog:** Fix bgcolor of dialog actions area ([f929142](https://github.com/zalando/dress-code/commit/f929142))
* **icons:** Fix header icons ([5304fd6](https://github.com/zalando/dress-code/commit/5304fd6))

### Features

* **status:** Define status indicator atom. Close #96. ([5ec9ef2](https://github.com/zalando/dress-code/commit/5ec9ef2)), closes [#96](https://github.com/zalando/dress-code/issues/96)

### BREAKING CHANGES

* **dialog**: style has been changed from a markup which used to look like this: ([f929142](https://github.com/zalando/dress-code/commit/f929142))

```html
<div class="dc-dialog__overlay">
 <div class="dc-dialog">
    <div class="dc-dialog__body">
       ...
    </div>
    <div class="dc-dialog__actions">
       ...
    </div>
 </div>
</div>
```

to a new more logical one which looks like this:

```html
<div class="dc-dialog">
 <div class="dc-dialog__overlay">
    <div class="dc-dialog__content">
       <div class="dc-dialog__body">
          ...
       </div>
       <div class="dc-dialog__actions">
          ...
       </div>
    </div>
 </div>
</div>
```

<a name="1.0.1-alpha"></a>
## [1.0.1-alpha](https://github.com/zalando/dress-code/compare/1.0.0-alpha...v1.0.1-alpha) (2016-02-16)


### Bug Fixes

* **patterns:** fix missing patterns classes ([28ee3f0](https://github.com/zalando/dress-code/commit/28ee3f0))



<a name="1.0.0-alpha"></a>
# [1.0.0-alpha](https://github.com/zalando/dress-code/compare/0.2.2-alpha.4...v1.0.0-alpha) (2016-02-16)

### Bug Fixes

* **demo/toast:** #86 fix error and warning toast modifiers, were exchanged by mistake ([eb64ef5](https://github.com/zalando/dress-code/commit/eb64ef5))
* **logo:** fix broken demo logo in ie10, close #103 ([a50958e](https://github.com/zalando/dress-code/commit/a50958e)), closes [#103](https://github.com/zalando/dress-code/issues/103)

### Features

* **dc-tooltip**: add dc-tooltip #86 ([6e977c0d6bab127af6dada9139a81fc852b1f050](https://github.com/zalando/dress-code/commit/6e977c0d6bab127af6dada9139a81fc852b1f050))
* **card:** add card atom, close #107 ([a9be85f](https://github.com/zalando/dress-code/commit/a9be85f)), closes [#107](https://github.com/zalando/dress-code/issues/107)
* **core/variables:** use !default for all the variables #86 ([7f3a401](https://github.com/zalando/dress-code/commit/7f3a401))
* **typography:** add dc-* placehoders, demo: update molecules order #86 ([59c79ed](https://github.com/zalando/dress-code/commit/59c79ed))

### BREAKING CHANGES

* sass: how to compiling sass changed.

    Change your code from this:

    ```scss
    @import bower_components/dress-code/sass/toolkit.scss
    // with npm: @import node_modules/dress-code/dist/sass/toolkit.scss
    ```

    To this:

    ```scss
    @import bower_components/dress-code/sass/dress-code.scss
    // with npm:  @import node_modules/dress-code/dist/sass/dress-code.scss
    @include dc-everything;
    ```

* icons: dc-font-icon was removed #80 ([6a5b430a26b2f23aca9ef6472ed29792c76724b2](https://github.com/zalando/dress-code/commit/6a5b430a26b2f23aca9ef6472ed29792c76724b2))

    If you were using dc-font-icon

    Replace this:

    ```
    <i class="dc-font-icon-add dc-font-icon--interactive"></i>
    ```

    With:

    ```
    <i class="dc-icon dc-icon--add dc-icon--interactive"></i>
    ```

    If you were using icons button

    Replace this:

    ```
    <button class="dc-btn dc-btn--large">
        <i class="dc-font-icon-add"></i>
    </button>
    ```

    With:

    ```
    <button class="dc-btn dc-btn--large">
        <i class="dc-icon dc-icon--add dc-icon--btn dc-icon--btn-large"></i>
    </button>
    ```

* dropdown: dc-dropdown radically changed #86 ([7fd01962faf33df62a5c52a0a1589f49e13664e8](https://github.com/zalando/dress-code/commit/7fd01962faf33df62a5c52a0a1589f49e13664e8))

    Replace this:

    ```html
    <div class="dc-btn-dropup">
        <button class="dc-btn dc-btn--primary">
            Dropup
            <span class="dc-arrow-up"></span>
        </button>
        <ul class="dc-dropdown-list">
            <li><a href="#">The first option</a></li>
            <li><a href="#">The second option</a></li>
            <li class="dc-divider"></li>
            <li><a href="#">Separated option</a></li>
        </ul>
    </div>
    ```

    with this:

    ```html
    <div class="dc-btn-dropdown">
        <button class="dc-btn dc-btn--primary">
            Dropup
            <span class="dc-btn-dropdown__arrow dc-btn-dropdown__arrow--up"></span>
        </button>
        <ul class="dc-btn-dropdown__list dc-btn-dropdown__list--up">
            <li class="dc-btn-dropdown__item">
                <a href="#" class="dc-link">The first option</a>
            </li>
            <li class="dc-btn-dropdown__item">
                <a href="#" class="dc-link">The second option</a>
            </li>
            <li class="dc-btn-dropdown__item dc-btn-dropdown__item--disabled">
                <a href="#" class="dc-link">Disabled option</a>
            </li>
            <li class="dc-btn-dropdown__divider"></li>
            <li class="dc-btn-dropdown__item">
                <a href="#" class="dc-link">Separated option</a>
            </li>
        </ul>
    </div>
    ```


<a name="0.2.2-alpha.4"></a>
## [0.2.2-alpha.4](https://github.com/zalando/dress-code/compare/0.2.2-alpha.3...v0.2.2-alpha.4) (2016-02-11)

### Bug Fixes

* **spinner**: Match spinner stroke to prod. Close #94 ([5aa6864](https://github.com/zalando/dress-code/commit/5aa6864))
* **demo/colors**: Match colors in toolkit YAML to SCSS vars ([ff4ce55](https://github.com/zalando/dress-code/commit/ff4ce55))


<a name="0.2.2-alpha.3"></a>
## [0.2.2-alpha.3](https://github.com/zalando/dress-code/compare/0.2.2-alpha.2...v0.2.2-alpha.3) (2016-02-09)

### Refactor

* **tables**: Clean up and extend tables ([48705caf4f7c33deb91dff1a406b44af6187a1ca](https://github.com/zalando/dress-code/commit/48705caf4f7c33deb91dff1a406b44af6187a1ca))


<a name="0.2.2-alpha.2"></a>
## [0.2.2-alpha.2](https://github.com/zalando/dress-code/compare/0.2.2-alpha.1...v0.2.2-alpha.2) (2016-01-26)


### Bug Fixes

* **scss-lint:** fix scss_lint errors after upgrading to 0.44.0 ([40f785a](https://github.com/zalando/dress-code/commit/40f785a))

### Features

* **search-form:** show search results which contain images and text labels #88 ([cc17d4e](https://github.com/zalando/dress-code/commit/cc17d4e))



<a name="0.2.2-alpha.1"></a>
## [0.2.2-alpha.1](https://github.com/zalando/dress-code/compare/0.2.2-alpha...v0.2.2-alpha.1) (2016-01-15)


### Features

* **dropdown:** Add dropdown dropup button molecule ([eb2960b](https://github.com/zalando/dress-code/commit/eb2960b))



<a name="0.2.2-alpha"></a>
## [0.2.2-alpha](https://github.com/zalando/dress-code/compare/0.2.1-alpha...v0.2.2-alpha) (2016-01-08)


### Bug Fixes

* **sass-versions-compatibility:** #82 use the placeholder syntax with dc-cf, remove normalize.css dep... ([fea826a](https://github.com/zalando/dress-code/commit/fea826a))



<a name="0.2.1-alpha"></a>
## [0.2.1-alpha](https://github.com/zalando/dress-code/compare/0.2.0-alpha...v0.2.1-alpha) (2016-01-07)


### BREAKING CHANGES

* grid: grid was removed #80 ([7f5dcf9](https://github.com/zalando/dress-code/commit/7f5dcf9))



<a name="0.2.0-alpha"></a>
# [0.2.0-alpha](https://github.com/zalando/dress-code/compare/0.1.1-alpha...v0.2.0-alpha) (2016-01-07)

### Features

* **divider:** Create a simple section divider ([7fc3870](https://github.com/zalando/dress-code/commit/7fc3870))
* **dropdown:** Add dropdown dropup button molecule ([a9d22d5](https://github.com/zalando/dress-code/commit/a9d22d5))
* **forms:** Create input groups ([668a712](https://github.com/zalando/dress-code/commit/668a712))
* **toasts:** Add toast molecule ([f5ad3d9](https://github.com/zalando/dress-code/commit/f5ad3d9))
* **loading-bar:** Add loading bar atom ([pull request #69](https://github.com/zalando/dress-code/pull/69))


<a name="0.1.1-alpha"></a>
## [0.1.1-alpha](https://github.com/zalando/dress-code/compare/0.1.0-alpha...v0.1.1-alpha) (2015-12-30)


### Bug Fixes

* **font-icon:** use the new variable dc-font-path when generating fot-icon.scss ([730d01c](https://github.com/zalando/dress-code/commit/730d01c))
* **forms:** Fix radio button label style ([e4a6fff](https://github.com/zalando/dress-code/commit/e4a6fff))
* **messages:** Fix hover and click behavior to match original ([7c66677](https://github.com/zalando/dress-code/commit/7c66677))
* **mix:** add minor fixes ([42ffbde](https://github.com/zalando/dress-code/commit/42ffbde))
* **sass-lint:** fix all warnings and errors thrown by sass-lint ([b319a5f](https://github.com/zalando/dress-code/commit/b319a5f))
* **table:** fix clearfix row table after scss-lint compliant refactor, close #52 ([220cdf0](https://github.com/zalando/dress-code/commit/220cdf0)), closes [#52](https://github.com/zalando/dress-code/issues/52)

### Features

* **button:** Fix dc prefix for button icons ([27e92e1](https://github.com/zalando/dress-code/commit/27e92e1))
* **button:** Fixes & lint ([b11aadd](https://github.com/zalando/dress-code/commit/b11aadd))
* **buttons:** Complete all buttons types ([01118c7](https://github.com/zalando/dress-code/commit/01118c7))
* **buttons:** Improve and extend button groups #16 ([91e312f](https://github.com/zalando/dress-code/commit/91e312f))
* **dialog:** Add dialog molecule ([18956d2](https://github.com/zalando/dress-code/commit/18956d2))
* **grid:** closes #18 and #6. create a fully responsive 12 column grid, add generic grid he ([6c00c31](https://github.com/zalando/dress-code/commit/6c00c31)), closes [#18](https://github.com/zalando/dress-code/issues/18) [#6](https://github.com/zalando/dress-code/issues/6)
* **grid:** Closes #18. switch to 12col grid, add grid demo page ([1280c21](https://github.com/zalando/dress-code/commit/1280c21)), closes [#18](https://github.com/zalando/dress-code/issues/18)
* **messages:** Add a new view for the icon font #32 ([07f3db1](https://github.com/zalando/dress-code/commit/07f3db1))
* **messages:** Beautified code #32 ([3504f3f](https://github.com/zalando/dress-code/commit/3504f3f))
* **messages:** Change of icon size #32 ([0ac4ccc](https://github.com/zalando/dress-code/commit/0ac4ccc))
* **messages:** Modify scss to reproduce current design ([ebd25df](https://github.com/zalando/dress-code/commit/ebd25df))
* **messages:** Use icon font for messages ([269aa13](https://github.com/zalando/dress-code/commit/269aa13))
* **spinner:** add dc-spinner, close #50 ([823bddc](https://github.com/zalando/dress-code/commit/823bddc)), closes [#50](https://github.com/zalando/dress-code/issues/50)
* **spinner:** Use shorter notation for border colors ([a0cb1fa](https://github.com/zalando/dress-code/commit/a0cb1fa))



<a name="0.1.0-alpha"></a>
# 0.1.0-alpha (2015-11-19)


### Bug Fixes

* **demo:** fixes #33. Change namespace inside demo scripts ([140487f](https://github.com/zalando/brand-solutions-dress-code/commit/140487f)), closes [#33](https://github.com/zalando/brand-solutions-dress-code/issues/33)
* **demo:** removes code auto select, fix #35 ([b38effe](https://github.com/zalando/brand-solutions-dress-code/commit/b38effe)), closes [#35](https://github.com/zalando/brand-solutions-dress-code/issues/35)
* **demo:** updates github link in the main navbar ([a0b4985](https://github.com/zalando/brand-solutions-dress-code/commit/a0b4985))
* **demo/icon:** put icons view under git version control ([b850e4e](https://github.com/zalando/brand-solutions-dress-code/commit/b850e4e))
* **gitignore:** ignore fonts folder ([cef0b09](https://github.com/zalando/brand-solutions-dress-code/commit/cef0b09))
* **gulp:** exclude BOWER-README when build static website ([1cc0ea8](https://github.com/zalando/brand-solutions-dress-code/commit/1cc0ea8))
* **npm:** fix .npmignore ([5c6f76c](https://github.com/zalando/brand-solutions-dress-code/commit/5c6f76c))
* **npm:** fix typo errors ([e6cc1f8](https://github.com/zalando/brand-solutions-dress-code/commit/e6cc1f8))
* **search-form:** ignore pointer-events on autosugget field while it is hidden ([fe3d049](https://github.com/zalando/brand-solutions-dress-code/commit/fe3d049))

### Features

* **font-icon:** merge develop updates, rename to dc-font-icon since the dc-icon was already take ([d57fb09](https://github.com/zalando/brand-solutions-dress-code/commit/d57fb09))
* **font-icon:** updates package.json install gulp plugin ([4449c97](https://github.com/zalando/brand-solutions-dress-code/commit/4449c97))
* **icon:** add svg icons, something is broken in the build tool ([83dcb7b](https://github.com/zalando/brand-solutions-dress-code/commit/83dcb7b))
* **icon-font:** #10 add the first icon font implementation ([3b647d2](https://github.com/zalando/brand-solutions-dress-code/commit/3b647d2))
* **metadata:** updates metadata #14 ([0bce961](https://github.com/zalando/brand-solutions-dress-code/commit/0bce961))
* **price-input:** resolves #37. Add price input field. ([bd254fe](https://github.com/zalando/brand-solutions-dress-code/commit/bd254fe)), closes [#37](https://github.com/zalando/brand-solutions-dress-code/issues/37)
* **text-input:** resolves #21. Add number input field ([c8f58e1](https://github.com/zalando/brand-solutions-dress-code/commit/c8f58e1)), closes [#21](https://github.com/zalando/brand-solutions-dress-code/issues/21)
* **text-input:** resolves #24. Add disabled input field. ([0aa06c0](https://github.com/zalando/brand-solutions-dress-code/commit/0aa06c0)), closes [#24](https://github.com/zalando/brand-solutions-dress-code/issues/24)
