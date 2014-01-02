(function (global, undefined) {

  'use strict';

  var document = global.document;
  var mocha = global.mocha;

  function ajax (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(xhr.responseText);
        }
      }
    };
    xhr.send();
  }

  var parent = document.getElementsByTagName('script')[0].parentNode;
  function newScript (source) {
    var script = document.createElement('script');
    script.language = 'javascript';
    script.type = 'text/javascript';
    script.defer = true;
    script.text = source;
    parent.appendChild(script);
  }

  ajax('/config', function (config) {
    config = JSON.parse(config);

    mocha.setup({
      'ui': config.ui,
      'reporter': 'html'
    });

    global.should = global.chai.should();
    global.expect = global.chai.expect;

    var files = config.files;

    function next () {
      var file = files.shift();
      ajax(file, function (source) {
        newScript(source);
        if (files.length) {
          next();
        } else {
          mocha.run();
        }
      });
    }

    next();
  });

})(this);