module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: [
      'features/support/**/*.js',
      'features/step-definitions/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
    ],
    parallel: 1,
    worldParameters: {
      baseUrl: 'https://the-internet.herokuapp.com/login',
    },
  },
};
