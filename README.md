
[![Build Status](https://travis-ci.org/zalando/dress-code.svg?branch=master)](https://travis-ci.org/zalando/dress-code)
[![Dependency Status](https://david-dm.org/zalando/dress-code.svg)](https://david-dm.org/zalando/dress-code)
[![devDependency Status](https://david-dm.org/zalando/dress-code/dev-status.svg)](https://david-dm.org/zalando/dress-code#info=devDependencies)
# The Dress Code

The Dress Code is a framework agnostic, atomic design, BEM, style library which is designed for maintainability and modularity.

Quickly create prototypes and sites or apps that work on all devices. See the Demo & Documentation for more details.

Dress Code follows BEM naming convention. Read more about BEM [here](http://getbem.com/introduction/).

## Quick links

* [Demo & Documentation](http://zalando.github.io/dress-code/)
* [Development & Contributing](#development)
* [Build and Deploy](#build-and-deploy)

## Browser Compatibility

Chrome 48+, Firefox 44+, Safari 8+, IE 10+.

## Getting Started

### Requirements

* [modernizer](https://modernizr.com/) ~2.8.2 included in the ```<head>``` of your web page.

### Install

#### with Bower

```
bower install dress-code --save
```

#### with Npm

```
npm install dress-code --save
```

### Usage


Include this in your ```<head>```:

```html
<link href="bower_components/dress-code/dist/css/dress-code.min.css" rel="stylesheet">
```

#### How to use dress-code SASS

You can compile the dress code by your own using a sass compiler.

```scss
@import "node_modules/breakpoint-sass/stylesheets/breakpoint" // this is a required dependency, load this before loading the dress-code
@import "node_modules/dress-code/dist/sass/dress-code" // or bower_components/dress-code/dist/sass/dress-code
@include dc-everything; // output dc-* selectors
```

> the dress-code rely on [breakpoint-sass](https://github.com/at-import/breakpoint) to manage media queries
more easily, please be sure that the plugin/scss module is loaded before trying to compile the dress-code stuff.


##### Compass notes

> Note for those using compass. Add this to yours config.rb file:
```rb
add_import_path "bower_components"
```
Then you can import the dress-code like so:
```scss
@import "dress-code/dist/sass/dress-code";
```

## <a name="development"> Development & Contributing

Developers interested in contributing should read the following guidelines:

- [Contributing Guidelines](docs/guides/CONTRIBUTING.md)
- [Coding Guidelines](docs/guides/CODING.md)
- [ChangeLog](CHANGELOG.md)
- [Releasing](docs/guides/RELEASING.md)

### Install

**Requirements**

* [node.js](http://nodejs.org). Make sure your have `v0.10` or higher installed before proceeding.
* [bower](http://bower.io/). Make sure you have bower installed globally with npm, if not, run this command:```npm install -g bower```
* [Ruby](https://www.ruby-lang.org/en/documentation/installation/) 1.9.3+. If you are using OSX it should be already installed.
* [Sass](http://sass-lang.com/install) 3.4.1+. to install: ```sudo gem install sass```
* [scss-lint](https://github.com/brigade/scss-lint) 0.44.0+ to install: ```sudo gem install scss_lint```

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

### Development Environment Features

- Sass compilation (using [node-sass](https://github.com/sass/node-sass))
- Sass linting (using [scss-lint](https://github.com/brigade/scss-lint))
- CSS Auto-prefixing / Optimization
- Image optimization
- Icon Font generator
- Demo/docs site generator
- Live preview sever (using [BrowserSync](http://www.browsersync.io/))
- CHANGELOG generator

## <a name="build-and-deploy"> Build & Deploy

**Build distribution:**

```
$ npm run build
```

The distribution build artifacts output to the `dist` directory.


**Build demo:**

```
$ npm run build:demo
```

Fabricator builds both a static documentation site and optimized CSS and JS toolkit files.

The demo build artifacts output to the `.tmp/.demo` directory. This can be deployed to any static hosting environment - no language runtime or database is required.


**Deploy demo:**

```
$ npm run deploy:demo
```

Publish the demo as github-pages website @ https://zalando.github.io/dress-code


## License

Copyright 2016 Zalando SE

The Dress Code is released under the MIT license. See LICENSE for details.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
