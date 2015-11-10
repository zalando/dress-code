# Brand Solutions Dress Code

The Brand Solutions Dress Code UI toolkit is a highly-modular design system for rapid web page development. It contains different materials that can be assembled into more complex page layouts.

## Quick links

* [Demo](http://zalando.github.io/brand-solutions-dress-code/)
* [Development](#development)
* [Build and Deploy](#build-and-deploy)

## Getting Started

Brand Solutions Dress Code requires:

* [node.js](http://nodejs.org). Make sure your have `v0.10` or higher installed before proceeding.
* [modernizer](https://modernizr.com/) included in the ```<head>``` of your web page

**Install**

with bower:

```
$ bower install git@github.com:zalando/brand-solutions-dress-code-bower.git
```

with npm:

```
$ npm install git+ssh://git@github.com:zalando/brand-solutions-dress-code.git
```

## <a name="development"> Development

**Install**

```
$ git clone https://github.com/zalando/brand-solutions-dress-code.git && cd brand-solutions-dress-code
$ npm install && bower install
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

The demo build artifacts output to the `demo` directory. This can be deployed to any static hosting environment - no language runtime or database is required.


**Deploy demo:**

```
$ npm run deploy:demo
```

Publish the demo as github-pages website @ http://zalando.github.io/brand-solutions-dress-code


**Deploy bower package:**

```
$ npm run deploy:bower
```

Publish the distribution version for bower @ http://zalando.github.io/brand-solutions-dress-code-bower  
