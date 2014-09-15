'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var Format = (function() {

  function cap(str) {
    return str.slice(0,1).toUpperCase() + str.slice(1);
  }

  function decap(str) {
    return str.slice(0,1).toLowerCase() + str.slice(1);
  }

  function camelCase(str, rep) {

    var replace = rep ? rep : '[_\-]';
    var regrep = new RegExp(replace, 'g');

    return str.replace(regrep, ' ').split(' ').map(function(v,i) {
      return i ? cap(v) : decap(v);
    }).join('');
  }

  function niceCase(str, rep) {

    var replace = rep ? rep : '[A-Z]';
    var regrep = new RegExp('(' + replace + ')', 'g');

    return str.replace(regrep, ' $1').split(' ').map(function(v) {
      return cap(v);
    }).join(' ');
  }

  var funcyBunch = {
    camelCase: camelCase,
    niceCase: niceCase
  };

  return funcyBunch;
})();

var TimStandardGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the funkadelic TimStandard generator!'
    ));

    var prompts = [
    {
      type: 'input',
      name: 'appName',
      message: 'How would you like to name your project ?',
      default: process.cwd().split(path.sep).pop()
    },
    {
      type: 'input',
      name: 'description',
      message: 'How would you describe your project ?',
      default: 'Super awesome project'
    }
    ];

    this.prompt(prompts, function (props) {
      this.appName = Format.camelCase(props.appName);
      this.appNiceName = Format.niceCase(props.appName);
      this.description = props.description;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      var folders = [
      'dist',
      'dev/js/test',
      'dev/js/vendor',
      'dev/js/' + this.appName,
      'dev/html',
      'dev/scss/' + this.appName + '/variables',
      'dev/scss/vendor'
      ];

      folders.forEach(function(folder){
        this.dest.mkdir(folder);
      }, this);

      this.template('_package.json', 'package.json');
      this.template('Gruntfile.js', 'Gruntfile.js');
      this.template('_bower.json', 'bower.json');

      this.template('_index.html', 'dev/html/index.html')
    },

    projectfiles: function () {

      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('jshintrc', '.jshintrc');

      this.src.copy('_main.js', 'dev/js/' + this.appName + '/main.js');
      this.src.copy('_main_spec.js', 'dev/js/test/main_spec.js');
      this.src.copy('_html5-3.6-respond-1.1.0.min.js', 'dev/js/vendor/html5-3.6-respond-1.1.0.min.js');

      this.src.copy('_main.scss', 'dev/scss/' + this.appName + '/main.scss');
      this.src.copy('_dabble.scss', 'dev/scss/' + this.appName + '/_dabble.scss');
      this.src.copy('_body.scss', 'dev/scss/' + this.appName + '/_body.scss');
      this.src.copy('_variables.scss', 'dev/scss/' + this.appName + '/variables/_variables.scss');
      this.src.copy('_colors.scss', 'dev/scss/' + this.appName + '/variables/_colors.scss');
      this.src.copy('_normalize.scss', 'dev/scss/vendor/_normalize.scss');
    }
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = TimStandardGenerator;
