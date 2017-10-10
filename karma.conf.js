var webpackConfig = require('./webpack.config');
webpackConfig.devtool = 'inline-source-map';

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    singleRun: true,
    frameworks: ['mocha', 'chai'],
    files: [
      'tests.webpack.js'
    ],
    plugins: [
      'karma-chai',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-mocha-reporter',
      'karma-sinon',
      'karma-sinon-chai'
    ],
    coverageReporter: {
      dir: 'coverage/',
      reporters: [{
          type: 'text'
        },
        {
          type: 'html',
          subdir: 'report-html',
          file: 'report.html'
        },
        {
          type: 'lcov',
          subdir: 'report-lcov',
          file: 'report.txt'
        }
      ]
    },
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    },
    autoWatch: true,
    colors: true,
  });
};