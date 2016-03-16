# RELEASING

### Step by step instructions to release a new version of the dress-code.

1) From the develop branch, move into a new release branch. The ```<semver>``` placeholder stay for a new semantic version (e.g. 0.4.1).
For more info, please take a look [here](http://semver.org/).

```
git checkout -b release/<semver>
```

2) Run the build.

```
npm run build
```

3) Increase ```bower.json``` and ```package.json``` <semver> version and run the task that updates the changelog. 

```
npm run changelog
```

4) Check the result and if needed adjust the output (```CHANGELOG.md```).
When done, commit the changes and push the release branch.

```
git add --all;
git commit -m "chore(release): <semver>";
git push -u;
```

5) **Wait the CI job running on [Travis](https://travis-ci.org/zalando/dress-code/builds).**

When the CI job pass with SUCCESS, merge or rebase the release branch on top of the master branch.

```
git checkout master;
git pull;
git rebase release/<semver>; # or open a pull request to master
```

6) Add a git tag, push the master branch and the new tag.

```
git tag -a <semver> -m "<semver>";
git push origin master;
git push origin <semver>; # push the tag
```

7) Build and deploy demo [docs/demo](http://zalando.github.io/dress-code/) artifacts. 

```
npm run deploy:demo;
```

8) Publish on npm registry.

```
npm publish
```

9) Keep in sync the develop branch.

```
git checkout develop;
git rebase master; # or git merge
git push origin develop;
```

