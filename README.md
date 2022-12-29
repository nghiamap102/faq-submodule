# VUI - Vietbando User Interface

## Get Started

Before starting either method, be sure to run `yarn`.

### Start Storybook

Storybook is an interface for viewing, building, and documenting a component library. To start Storybook, run `yarn storybook` and open `http://localhost:6006/` in your browser.

### Side Development with other app

In order to import this package into another project, first run `yarn start`.

Next, run `yarn link` in order to create a symlink between your global `node_modules` and your `dist` folder.

Go to `node_modules/react` and run `yarn link` and repeat with `node_module/react-dom` and `node_module/react-router-dom`

Finally, in your project, run `npm link @vbd/vui react react-dom react-router-dom` (yarn or npm is dependent on the project). Then you will be able to import VUI components and classes as if it were installed from npm.

> **Note:** VUI has peer dependencies for `react`, `react-dom`, and `react-router-dom`. The package will only work if it is installed into a project that has those packages as dependencies.

### Image Size

All images reference by url in component will be converted to base64 (`@rollup/plugin-url`) as long as it smaller than 50kb (setting in `rollup.config.js`)

So please minify your images before using (resize, [compress](https://tinypng.com/)...)
### Step to publish VUI
1. Run build (`yarn build`) and tests (if there are any)
2. Update version in `package.json` according to `Semver`
3. Commit and create a git tag according to `Semver`
4. Push the package to `Gitlab`
5. Push the package to `npm`
6. Create `release notes` for every major update

### Easy Publish using `np`
 - Install `np` as a global cli `npm i -g np`
 - Make sure you're on `master` and has a `clean` git status
 - run `np` and pick the version

