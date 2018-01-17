
[![Build Status](https://travis-ci.org/zalando/dress-code.svg?branch=master)](https://travis-ci.org/zalando/dress-code)
[![Dependency Status](https://david-dm.org/zalando/dress-code.svg)](https://david-dm.org/zalando/dress-code)
[![devDependency Status](https://david-dm.org/zalando/dress-code/dev-status.svg)](https://david-dm.org/zalando/dress-code#info=devDependencies)
[![Gitter](https://badges.gitter.im/zalando/dress-code.svg)](https://gitter.im/zalando/dress-code)

# The Dress Code

The Dress Code is a style library / style guide which is designed for maintainability and modularity.

Used by Zalando Brand Solutions department to solve the challenge of consistency between multiple apps.

We open sourced the project because we think it's a good example of how collaboration between UX Designers and Developers is enhancing consistency and user experience with the help of technology.

If you want to know more about the history and the process behind this project you might be interested in [this article](https://tech.zalando.com/blog/dress-code-an-in-house-style-guide-for-zalandos-solution-center/).

## Quick links

* [Demo & Documentation](http://zalando.github.io/dress-code/)
* [Getting Started](#getting-started)
* [Development & Contributing](#development)

## Main Features

* Follows [BEM](http://getbem.com/) — Block Element Modifier methodology

* Follows [Atomic Design](http://atomicdesign.bradfrost.com/chapter-2/) principles

* Built with [Sass](http://sass-lang.com/), that means:
    * Modular - import just what you need
    * Reusable - apply styles on your own components by using Sass mixins
    * Customizable - "tweak" the look and feel by overriding variables or extending existing classes

* Updated interactive demo site

## Status

The Dress Code core is actively maintained by two teams within Zalando. The core components are in a stable state, should you however encounter any bugs, feel free to create an issue and/or a pull request

We are always looking forward to **open source community feedback** and **contributions** especially about:

* browser/device compatibility bugs
* enhancements

We usually mark the issues where we would like to see community contributions with a "help wanted" label.

Feel free to open issues and/or fork the project to contribute ([see Development & Contrbuting section](#development)).


## Browser Compatibility

Chrome 48+, Firefox 44+, Safari 8+, IE 10+.

## Semantic Versioning

The Dress Code follows [semantic version standards](https://semver.org/).

However, to be clear, we must describe which part of the exposed API we consider public and which one we consider private.
When using common programming languages such as Java, PHP or Javascript this concept is usually defined by the language semantics (eg. private or protected keywords) or by some naming conventions (eg. having an `_underscore` before the name of the function or the variable).

The Dress Code considers part of the **PUBLIC** API just:

* all css class names and selectors exposed by the library
* all mixins representing a corresponding css selector (eg. `@mixin dc-btn`)
* all others documented [Sass](http://sass-lang.com/) variables/placeholder/mixins (we consider a Sass variable/mixin/placeholder documented just if it's mentioned in the Sass reference published on the [documentation website](http://zalando.github.io/dress-code/)).

> Everything else is considered **PRIVATE**, that means you can still use it but at your own "risk".

## Getting Started

### Requirements

* [modernizer](https://modernizr.com/) ~2.8.2 included in the ```<head>``` of your web page.

### Installation


```
npm install dress-code --save
```

> :warning: **NOTE**: We recently dropped **bower** support (from version 2.1.0). Keep calm and do `npm`.  


### Usage


Include this in your ```<head>```:

```html
<link href="node_modules/dress-code/dist/css/dress-code.min.css" rel="stylesheet">
```


#### How to use Dress Code with Sass

If you are already using Sass in your project, you can import the Dress Code directly.

```scss
@import "node_modules/dress-code/dist/sass/dress-code";
@include dc-everything; // output dc-* selectors
```

When using Sass, customization can be achieved by:

* Updating **variable** values, you can take a look at `src/styles/core/_variables.scss` to see all available variables and their default values.

* Apply **mixins** to your elements, nearly every css selector has a corresponding mixin.

> **NOTE**: Given that, for example, the compiled css file will be served at `/styles/main.css`, by default **Fonts** and **Images** will be served from `/fonts` and `/img` path.<br><br>
To adjust this behavior according to your setup, update the `$dc-font-path` and `$dc-image-path` variable values.

##### Compass notes

> For those using Compass, you can add this to your config.rb file:
```rb
add_import_path "node_modules"
```
Then you can import the dress-code like so:
```scss
@import "dress-code/dist/sass/dress-code";
```

## <a name="development"> Development & Contributing

Developers interested in contributing should read the following:

- [Contributing Guidelines](CONTRIBUTING.md)
- [Coding Guidelines](docs/guides/CODING.md)
- [ChangeLog](CHANGELOG.md)
- [Releasing](docs/guides/RELEASING.md)

### Install

**Requirements**

* [node.js](http://nodejs.org). Make sure your have `v7.0.0` or higher installed before proceeding.

**Install**

```
$ git clone https://github.com/zalando/dress-code.git && cd dress-code
$ npm install
```

**Start the local development environment:**

```
$ npm start
```

> To open a new browser window or to pass a value to [browserSync open option](https://www.browsersync.io/docs/options/#option-open):
```
npm start -- --open
```

### Visual regression tests

**Initialization:**

In order to avoid unexpected visual changes we have setup an automated visual regression testing system based on [PhantomCSS](https://github.com/Huddle/PhantomCSS), which generates and compares screenshots taken on all the components of Dress Code with their previous state, based on the demo page templates, notifying the developer about all the discrepancies found so they can be reviewed and ajusted properly before opening a pull request.

This system can be initialized in three different modes by using any of the following npm scripts:

```
$ npm run test

$ npm run test:minified

$ npm run test:rebase
```

By default, with the former npm script, the system will run all the test cases using an unminified version of the artifact, which will be built to incorporate the current changes.

The second option is intended for releases, which will run the tests by using the minified version of the artifact bundled to be distributed with the new version about to be released.

Last, the latter option regenerates the baseline used for further image comparisons, which represents the current validated state of the Dress Code components. By using this option, the developer states that the changes notified by the diff are done purposely and will become the new look of such affected component from that moment on.  

**Test cases:**

Test cases are described in _tests/globals.js_ by specifying the name of the component (atom or molecule) to be tested and an array containing the names of the template files related to that component in the demo.

On execution, descriptive messages will be shown in console informing about each test suite's results.

**Screenshots:**

The system will generate a screenshot per each file and store them into several directories, grouped by component name, under either _tests/screenshots/baseline_ or _tests/screenshots/results_ depending on the execution mode chosen.

Since storing that many generated binary files in Git is not recommended as it may lead to problems in repositories drastically growing in size, we took advantage of GitHub's open source library [Git Large File System (LFS)](https://git-lfs.github.com/) which replaces the content of a binary file by text pointers to the actual content location where they are stored in the server.

Please make sure to follow the steps described at their website to install and configure it properly.

#### Adding new icons

Make sure your icons have a size of 512x512px and flatten and simplify the paths before you export them. Place each icon as SVG file into `src/icons/`. Add each new icon in the demo by adding it in `docs/demo/materials/03-atoms/icons/01-icons.html` such as

```
    <div class="sg-icon dc-column">
        <i class="dc-icon dc-icon--[ICON-FILENAME]"></i><span>[ICON-FILENAME]</span>
    </div>
```

and replace `[ICON-FILENAME]` with the actual icon filename. Run `npm start -- --open` to see the result.

### Development Environment Features

- Sass compilation (using [node-sass](https://github.com/sass/node-sass))
- Sass linting (using [scss-lint](https://github.com/brigade/scss-lint))
- CSS Auto-prefixing / Optimization
- Image optimization
- Icon Font generator
- Demo/docs site generator
- Live preview sever (using [BrowserSync](http://www.browsersync.io/))
- CHANGELOG generator
- Visual regression testing

## <a name="build-and-deploy"> Build & Deploy

**Build distribution:**

```
$ npm run build
```

The distribution build artifacts output to the `dist` directory.


**Build demo:**

```
$ npm run demo:build
```

Fabricator builds both a static documentation site and optimized CSS and JS toolkit files.

The demo build artifacts output to the `.tmp/.demo` directory. This can be deployed to any static hosting environment - no language runtime or database is required.


**Deploy demo:**

```
$ npm run demo:deploy
```

Publish the demo as github-pages website @ https://zalando.github.io/dress-code


## License

Copyright 2016 Zalando SE

The Dress Code is released under the MIT license. See LICENSE for details.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
