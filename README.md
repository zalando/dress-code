# The Dress Code

The Dress Code UI toolkit is a highly-modular design system for rapid web page development. It contains different materials that can be assembled into more complex page layouts.

## Quick links

* [Demo](http://zalando.github.io/dress-code/)
* [Development & Contributing](#development)
* [Build and Deploy](#build-and-deploy)

## Getting Started

#### Requirements

* [node.js](http://nodejs.org). Make sure your have `v0.10` or higher installed before proceeding.
* [modernizer](https://modernizr.com/) included in the ```<head>``` of your web page

**Install**

with bower:

```
$ bower install git@github.com:zalando/dress-code-bower.git
```

with npm:

```
$ npm install git+ssh://git@github.com:zalando/dress-code.git
```

## <a name="development"> Development & Contributing

Developers interested in contributing should read the following guidelines:

- [Contributing Guidelines](docs/guides/CONTRIBUTING.md)
- [Coding Guidelines](docs/guides/CODING.md)
- [ChangeLog](CHANGELOG.md)


### Install

**Requirements**

* [node.js](http://nodejs.org). Make sure your have `v0.10` or higher installed before proceeding.
* [bower](http://bower.io/). Make sure you have bower installed globally with npm, if not, run this command:```npm install -g bower```
* [Ruby](https://www.ruby-lang.org/en/documentation/installation/) 1.9.3+. If you are using OSX it should be already installed.
* [Sass](http://sass-lang.com/install) 3.4.1+. to install: ```sudo gem install sass```
* [scss-lint](https://github.com/brigade/scss-lint) to install: ```sudo gem install scss_lint```

**Install**

```
$ git clone https://github.com/zalando/dress-code.git && cd dress-code
$ npm install
```

**Start the local development environment:**

```
$ npm start
```

### Development Environment Features

- Live preview sever (using [BrowserSync](http://www.browsersync.io/))
- CSS Autoprefixing
- Sass compilation
- Browserify bundling
- Image optimization

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


**Deploy bower package:**

```
$ npm run deploy:bower
```

Publish the distribution version for bower @ https://github.com/zalando/dress-code-bower  

## License

The Dress Code is released under the MIT license. See LICENSE for details.
