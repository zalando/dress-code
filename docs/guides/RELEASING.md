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
When done commit the changes and push the release branch.

```
git commit -m "chore(release): <semver>";
git push -u;
```

5) **Wait the CI job running on [Travis](https://travis-ci.org/zalando/dress-code/builds).**

When the CI job pass with SUCCESS, merge or rebase the release branch on top of the master branch.

```
git checkout master;
git pull;
git rebase release/<semver>;
```

6) Add a git tag, push the master branch and the new tag.

```
git tag -a <semver> -m "<semver>";
git push origin master;
git push origin <semver>; # push the tag
```

7) Sync the ```bower``` version.

```
npm run deploy:bower
cd .tmp/.deploy-bower
git tag -a <semver> -m "<semver>";
git push origin <semver>; # push the tag
git checkout develop;
git rebase master;
git push origin develop;
git checkout master;
```

8) Build and deploy [docs/demo](http://zalando.github.io/dress-code/) artifacts. 

```
npm run deploy:demo;
```

9) Keep in sync the develop branch.

```
git checkout develop;
git rebase master;
git push origin develop;
```
