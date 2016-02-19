# Coding Conventions and Guidelines

## Coding conventions:

* We use the [BEM](http://getbem.com/introduction/) approach to write css.
* Every css class must be prefixed with ```dc-```.

## Sass conventions:

* All variables and mixins must be prefixed with ```dc-``` and must use the ***snake-case*** (with dashes as separator).


## Notes

### Future compatibility

Each atom/molecules/module is prepared to be independently loaded, by requiring its own dependencies.
So you will notice at the top of each file a commented import directive, something like this:


```scss

// @import "../core/core";

@mixin dc-checkbox($sibling-label-selector : ".dc-label") {
    // ...
}

```

We hope that sass 4 brings us a new cool import directive that works as the less one (import once by default).
We are not the only one requesting that [feature](https://github.com/sass/sass/issues/156)
