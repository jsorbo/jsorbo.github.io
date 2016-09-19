# angular-d3

This project is a bare bones Angular application that will serve as a starting point for building
data visualizations using D3.js.

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Build & development

This project uses the Gulp task runner.

Run `gulp build` for building and `gulp serve` for preview.

## Testing

Running `gulp test` will run the unit tests with karma.

# Development details

This project is based on [D3 on Angular: How to use d3.js visualizations in an angular.js web app?](http://www.robinwieruch.de/d3-on-angular-seed/).

The following are some additional details that may help you set up your development environment and scaffold a new application.

## Dev tools

Be sure your installations of Node.js and NPM are up to date.

Install Yeoman, Bower, and some other tools with the following command.

```
npm install -g grunt-cli bower yo generator-karma generator-angular
```

## Scaffolding

Use Yeoman to scaffold your app.

```
yo angular [appName]
```

## Test runner installation issues

Grunt is the default task runner. However, if you choose Gulp, during the scaffolding process you may
see a message like this:

```
npm WARN gulp-karma@0.0.4 requires a peer of karma@>=0.10 <=0.13 but none was installed.
```

You can ignore this message, because Gulp plugins are not developed by the Karma team. 
[Instead, they encourage calling Karma directly from the Gulp task.](https://github.com/karma-runner/gulp-karma#do-we-need-a-plugin)

So, you can remove gulp-karma with the following command:

```
npm uninstall --save-dev gulp-karma
```

To run tests you may need to run the following:

```
npm install karma-phantomjs-launcher --save-dev
npm install jasmine-core --save-dev
npm install karma-jasmine --save-dev
```

Further details on Karma configuration are provided below, so read on...

## Gulp issues

The Gulp support in the Yeoman Angular Generator contains some bugs out of the box. To address these issues, change
your gulpfile.js [as described here.](https://github.com/yeoman/generator-angular/issues/1299)

If you chose not to use Sass in the scaffolding options, you will want to complete the following:

1. Change your styles path to use CSS files instead of SCSS files.
    * Replace this:
    ```javascript
    styles: [yeoman.app + '/styles/**/*.scss']
    ```
    * with this:
    ```javascript
    styles: [yeoman.app + '/styles/**/*.css']
    ```

2. Remove the SASS piping block:

    ```javascript
    .pipe($.sass, {
        outputStyle: 'expanded',
        precision: 10
    })
    ```

## Karma configuration

Here are the steps for configuring Karma in your gulpfile.js.

1. Add a reference to the Karma server at the top of your gulpfile.

    ```javascript
    var karmaServer = require('karma').Server;
    ```

2. Replace your paths definition.

    ```javascript
    var paths = {
    scripts: [yeoman.app + '/scripts/**/*.js'],
    absoluteScripts: [__dirname + '/' + yeoman.app + '/scripts/**/*.js'],
    styles: [yeoman.app + '/styles/**/*.css'],
    test: ['test/spec/**/*.js'],
    absoluteTest: [__dirname + '/test/spec/**/*.js'],
    testRequire: [
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-cookies/angular-cookies.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'bower_components/angular-route/angular-route.js',
        'bower_components/angular-animate/angular-animate.js',
        'bower_components/angular-touch/angular-touch.js',
        'bower_components/angular-ui-sortable/sortable.js',
        'bower_components/angular-local-storage/dist/angular-local-storage.js',
        'test/mock/**/*.js',
        'test/spec/**/*.js'
    ],
    karma: __dirname + '/' + yeoman.test + '/karma.conf.js',
    views: {
        main: yeoman.app + '/index.html',
        bowermain: yeoman.temp + '/index.html',
        files: [yeoman.app + '/views/**/*.html']
    }
    };
    ```

3. Replace your `test` task.

    ```javascript
    /**
    * Run tests once and exit.
    */
    gulp.task('test', function (done) {
    new karmaServer({
        files: paths.testRequire.concat(paths.absoluteScripts, paths.absoluteTest),
        configFile: paths.karma,
        singleRun: true
    }, done).start();
    });

    /**
    * Watch for file changes and re-run tests on each change
    */
    gulp.task('tdd', function (done) {
    new karmaServer({
        files: paths.testRequire.concat(paths.absoluteScripts, paths.absoluteTest),
        configFile: paths.karma
    }, done).start();
    });
    ```

# Try it out

Before you proceed with d3 installation, I would try running all the Gulp tasks listed in the gulpfile.

I think I've covered all the obstacles I encountered along the way. If you run into any trouble, please
feel free to contact me.

Happy Coding!