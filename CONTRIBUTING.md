# Contributing to Dress Code

## Git workflow

The git workflow that we use to contribute is mostly based and well explained in this article: [a-successful-git-branching-model](http://nvie.com/posts/a-successful-git-branching-model/)

#### Main branches:

* **master** : the default branch. Never work on it directly, always merge ***topic*** branches and ***hotfix*** branches into this branch.
* **topic/[topic-name]**: for every new feature or task, open a ***topic*** branch from ***master*** and work on it, when you are done open a pull request and ask for review.
* **hotfix/[hotifx-name]**: used to fix stable versions
* **release/[release-name]**: used to work on release candidates

> If a github issue is related to a branch we suggest to append the number at the end of the branch name.<br>
  example: topic/dropdown-refactor-98


## <a name="commit"></a> Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**. It is
important to note that we use the git commit messages to **generate** the Dress Code
[Changelog](CHANGELOG.md) document.

> A detailed explanation of guidelines and conventions can be found in this
  [document](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#).

### <a name="commit-message-format"></a> Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```html
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

> Any line of the commit message cannot be longer 100 characters!<br/>
  This allows the message to be easier to read on github as well as in various git tools.

#### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

#### Scope
The scope could be anything specifying the place of the commit change.

#### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

#### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes"
The body should include the motivation for the change and contrast this with previous behavior.

#### Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

> Breaking Changes are intended to highlight (in the ChangeLog) changes that will require community
  users to modify their code with this commit.


<br/>

#### Sample Commit message:

```text
refactor(button): prefix btn class with dc-

    BREAKING CHANGE: btn class now is prefixed with dc namespace.

    Change your code from this:

    ```html
    <button class="btn">submit</button>
    ```

    To this:

    ```html
    <button class="dc-btn">submit</button>
    ```
```
