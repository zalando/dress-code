# The Dress Code

The Dress Code is the official style guide and style framework for all Brand Solutions products.

[![Build Status](https://travis-ci.org/zalando/dress-code.svg?branch=master)](https://travis-ci.org/zalando/dress-code)

## Quick links

* [Demo](http://zalando.github.io/dress-code/)
* [Development & Contributing](#development)
* [Build and Deploy](#build-and-deploy)

## Getting Started

### Requirements

* [modernizer](https://modernizr.com/) included in the ```<head>``` of your web page.

### Install

#### with Bower

```
bower install https://github.com/zalando/dress-code-bower.git --save
```

#### with Npm

Add the dress-code as a dependency in your package.json

```
{
  "dependencies": {
    "dress-code": "git+https://github.com/zalando/dress-code.git"
  }  
}
```

and run

```
npm install
```

> **At the moment we don't support ```npm@3``` and ```node@5.x```**

### Usage

#### with Bower

- Using the pre-compiled version:

Include this in your ```<head>```:

```html
<link href="bower_components/dress-code/css/dress-code.min.css" rel="stylesheet">
```

- Compiling sass:

```scss
@import "bower_components/dress-code/sass/dress-code"
@include dc-everything; 
```

if you wanna use just mixins and variables don't call ```dc-everything``` mixin.

```scss
@import "bower_components/dress-code/sass/dress-code" 
```

> Note for those using compass. Add this to yours config.rb file: 
```rb
add_import_path "bower_components"
```
Then you can import the dress-code like so: 
```scss
@import "dress-code/sass/dress-code";
```

#### with Npm (<3.x)

- Using the pre-compiled version:

Include this in your ```<head>```:

```html
<link href="node_modules/dress-code/dist/css/dress-code.min.css" rel="stylesheet">
```

- Compiling sass:

```scss
@import "node_modules/dress-code/dist/sass/dress-code" 
@include dc-everything; 
```

if you wanna use just mixins and variables don't call ```dc-everything``` mixin.

```scss
@import "node_modules/dress-code/dist/sass/dress-code" 
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
