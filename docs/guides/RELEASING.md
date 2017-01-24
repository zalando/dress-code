# RELEASING

### Step by step instructions to release a new version of the dress-code.

1) Pull latest from the `develop` branch and run the following command. Ensure that you follow the
[semver specification](http://semver.org/).

```
npm run release [<newversion> | major | minor | patch]
```

2) A release branch will be created and pushed automatically. Open a PR from the release branch to `develop`.

3) After the release branch is merged into `develop`, open a PR from `develop` to `master`.

4) After the PR is merged, publish on npm registry. After publish completes, the `npm` version will be verified.

```
git checkout master
git pull
npm publish
```

5) Upon successful publish, create and push the tag. The following command will do both steps automatically.

```
npm run tag:release
```

6) From the `master` branch, deploy [docs/demo](http://zalando.github.io/dress-code/) artifacts.

```
git checkout master
git pull
npm run deploy:demo
```

7) Keep the develop branch in sync.

```
git checkout topic/<issue-number-and-description>
git rebase master   # or git merge
git push origin topic/<issue-number-and-description>

# Now open a PR from the topic branch to develop. 
```

