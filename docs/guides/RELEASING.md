# RELEASING

### Step by step instructions to release a new version of the dress-code.

1) Pull latest from the `develop` branch and run the following command. Ensure that you follow the
[semver specification](http://semver.org/).

```
npm run release [<newversion> | major | minor | patch]
```

2) Open a PR from `develop` to `master` using the release branch that was just pushed.


3) After the PR is merged, pull the `master` branch and deploy [docs/demo](http://zalando.github.io/dress-code/) artifacts.

```
git checkout master;
git pull;
npm run deploy:demo;
```

4) Publish on npm registry. After publish completes, both `npm` and `bower` versions will be verified.

```
npm publish
```

5) Keep in sync the develop branch.

```
git checkout develop;
git rebase master; # or git merge
git push origin develop;
```

