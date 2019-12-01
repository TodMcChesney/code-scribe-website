# Code Scribe Website

This is the source code for my personal website.

## Getting Started

First clone or download the repo to your local computer. Then to get the
project up and running for development and testing you will need to
setup gulp.

### Requires
- Node.js
- gulp-cli (installed globally)

### Install
From the command line in the root project folder run:

```$ npm install```

This will install gulp locally with all the necessary modules.

### Running Dev Environment

```$ gulp```

This task spins up a localhost server, compiles the Sass to prefixed CSS
and watches all files for changes. BrowserSync automatically opens the
index.html page and refreshes the site after any changes are saved.

### Building Production Code

```$ gulp build```

This task cleans the dist folder first by deleting any old contents.
Then the js, css, and html files are minified and all files are copied
over to the clean dist folder. The css is inlined into the html and the link
to the js is updated to the .min version.

## License
MIT © Tod McChesney
