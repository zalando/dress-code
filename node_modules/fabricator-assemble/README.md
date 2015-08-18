# Fabricator Assemble

[![Build Status](https://travis-ci.org/fbrctr/fabricator-assemble.svg?branch=master)](https://travis-ci.org/fbrctr/fabricator-assemble) [![npm version](https://badge.fury.io/js/fabricator-assemble.svg)](http://badge.fury.io/js/fabricator-assemble)

> The assembly engine behind Fabricator

Turn this:

```html
---
title: Document Name
name: World
---

<h1>{{home.greeting}}, {{name}}!</h1>

{{> button}}
```

into this:

```html
<!doctype html>
<html lang="en">
<head>
    <title>Document Name</title>
</head>
<body>

    <h1>Hello, World!</h1>

    <a href="#" class="button">Click me!</a>

</body>
</html>
```

## Usage

The task returns a promise, so it can be used in an async task runner, like Gulp:

```js
var assemble = require('fabricator-assemble');
var gulp = require('gulp');

gulp.task('assemble', function () {
	return assemble(options);
});
```

The task accepts options, but assumes this directory structure:

```
└── src
	├── data
	│   └── *.{json,yml}
	├── docs
	│   └── *.md
	├── materials
	│   └── components
	│       └── *.html
	└── views
	    ├── *.html
	    └── layouts
	        └── default.html
```

## Options

Default options:

```
{
	layout: 'default',
	layouts: 'src/views/layouts/*',
	layoutIncludes: 'src/views/layouts/includes/*',
	views: ['src/views/**/*', '!src/views/+(layouts)/**'],
	materials: 'src/materials/**/*',
	data: 'src/data/**/*.{json,yml}',
	docs: 'src/docs/**/*.md',
	keys: {
		materials: 'materials',
		views: 'views',
		docs: 'docs'
	}
	helpers: {},
	logErrors: false,
	onError: function(error) {},
	dest: 'dist'
}
```

### options.layout

Type: `String`  
Default: `default`

Name of the default layout template. 

### options.layouts

Type: `String` or `Array`  
Default: `src/views/layouts/*`

Files to use as layout templates.

### options.layoutIncludes

Type: `String` or `Array`  
Default: `src/views/layouts/includes/*`

Files to use as layout includes.

### options.views

Type: `String` or `Array`  
Default: `['src/views/**/*', '!src/views/+(layouts)/**']`

Pages to pass through the assembler to be templated. Fabricator pages are stored at the root level `views` and user-defined views can be stored in subdirectories.

### options.materials

Type: `String` or `Array`  
Default: `src/materials/**/*`

Files to use a partials/helpers. These are the materials that make up your toolkit. by default, Fabricator comes with "components" and "structures", but you can define your own taxonomy.

### options.data

Type: `String` or `Array`  
Default: `src/data/**/*.{json,yml}`

JSON or YAML files to use as data for views.

### options.docs

Type: `String` or `Array`  
Default: `src/docs/**/*.md`

Markdown files containing toolkit-wide documentation

### options.keys

Type: `Objects`  
Default: `materials/views/docs`

Object keywords for accessing "materials", "views", and "docs" in a view templating context. Fabricator uses some specific terms like "materials" to describe what are really "partials" in Handelbars. This option give you the flexibility to define your own terms for `materials`, `views`, and `docs`.

For example:

```
assemble({
	keys: {
		materials: 'patterns'
	}
});
``` 

```
<!-- formerly `{{#each materials}}` -->
{{#each patterns}}

	<h1>{{name}}</h1>

	{{#each items}}
		<h2>{{name}}</h2>
	{{/each}}

{{/each}}
```

**Note**: this will also change the built-in `{{material <foo>}}` helper to use the **singular** form of whatever is defined for the `materials` key. e.g. `materialKey: 'patterns'` -> `{{pattern <foo>}}`. If you set a new key for `materials`, you will also need to update the `f-item-content.html` include to use the new helper name.

### options.helpers

Type: `Object`  
Default: `{}`

User-defined helpers. E.g.:

```javascript
helpers: {
	markdown: require('helper-markdown'),
	foo: function () {
		return 'bar';
	}
}
```

### options.logErrors

Type: `Boolean`  
Default: `false`

Whether or not to log errors to console. If set to false, the app will exit on error.

### options.onError

Type: `Function`  
Default: `null`

Error handler function. Receives an `error` object param.

### options.dest

Type: `String`  
Default: `dist`

Destination of compiled views (where files are saved to)

## Usage

### Definitions

- **Layouts**: wrapper templates
- **Views**: individual pages
- **Materials**: partial views; registered as "partials" and "helpers" in Handlebars
- **Data**: Data piped in as template context
- **Docs**: Markdown files containing documentation.

#### Layouts

Layouts are wrappers for pages. You can define as many layouts as you want by creating `.html` files in your layouts folder.

Example layout:

```html
<!doctype html>
<html lang="en">
<head>
    <title>{{title}}</title>
</head>
<body>

    {% body %}

</body>
</html>
```

Page content is inserted in the `{% body %}` placeholder.

Context can be passed from a page to the layout via front matter.

The layout a page uses is also defined in front matter:

```html
---
layout: custom-layout
title: My Custom Layout
---
```

This would use `custom-layout.html`.

When no `layout` property is defined, the page uses the `default` layout.

#### Views

Views are unique pages templated using Handlebars. These are both Fabricator pages and user-created pages (i.e. example templates)

View example:

```html
---
title: Document Name
name: World
---

<h1>{{home.greeting}}, {{name}}!</h1>

{{> button}}

```

This outputs a page that uses the default layout (since no layout was defined).

The front matter block at the top provides context to both the layout and the page itself.

Context is also piped in from data files (see below). In this example, `{{home.greeting}}` refers to the `greeting` property in `home.json`.

Fabricator pages are typically stored at the root level of the `views` directory and user-created views (e.g. "templates", "pages", "interfaces") should be stored in subdirectories.

#### Materials

Materials are partial templates; think of them as the materials used to build pages. 

They are accessed as a "partial" using the `>` syntax in Handlebars:

```html
{{> material-name}}
```

Any file in the glob defined in `options.materials` is turned into a partial/helper and can be accessed as such. For example, assume the `components` contains materials:

```
└── components
    ├── button.html
    └── form-toggle.html
```

The content within these files can be accessed as such:

```html
{{> button}}
{{> form-toggle}}
```

#### Ordering

You can manually order materials by prefixing the file name with numbers:

```
01-foo.html
01.01-bar.html
02-qux.html
```

This defines the order in which materials will appear in the side menu or other places the `materials.items` context is used.

**Note**: The number prefixes are ignored when registering partials, so you'll still be able to access them using the material name per usual. e.g.:

```
{{> foo}}
{{> bar}}
{{> qux}}
```

The numbers are also ignored in the `.name` property. The materials above would list as:

```
Foo
Bar
Qux
```

#### Data

Data is defined as JSON or YAML.

The `data` folder can contain several `.json` or `.yml` files:

```
└── data
    ├── home.json
    └── contact.yml
```

`home.json`:

```json
{
  "greeting": "Hello"
}
```

The data within each file can be accessed using dot notation:

```html
{{home.greeting}}
{{contact.propName}}
```

#### Docs

Docs are just a generic way to capture toolkit documenation that's not specific to a material. This could be something like JavaScript architecture, accessibility guidelines, etc.

Docs are written in markdown and are stored in `src/docs` by default.
