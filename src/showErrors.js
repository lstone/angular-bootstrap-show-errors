(function() {
  var showErrorsModule;

  showErrorsModule = angular.module('ui.bootstrap.showErrors', []);

  showErrorsModule.directive('showErrors', [
    '$timeout', 'showErrorsConfig', function($timeout, showErrorsConfig) {
      var getShowMessages, getShowSuccess, getTrigger, linkFn;
      getTrigger = function(options) {
        var trigger;
        trigger = showErrorsConfig.trigger;
        if (options && (options.trigger != null)) {
          trigger = options.trigger;
        }
        return trigger;
      };
      getShowSuccess = function(options) {
        var showSuccess;
        showSuccess = showErrorsConfig.showSuccess;
        if (options && (options.showSuccess != null)) {
          showSuccess = options.showSuccess;
        }
        return showSuccess;
      };
      getShowMessages = function(options) {
        var showMessages;
        showMessages = showErrorsConfig.showMessages;
        if (options && (options.showMessages != null)) {
          showMessages = options.showMessages;
        }
        return showMessages;
      };
      linkFn = function(scope, el, attrs, formCtrl) {
        var blurred, inputEl, inputName, inputNgEl, options, showMessages, showSuccess, toggleClasses, trigger;
        blurred = false;
        options = scope.$eval(attrs.showErrors);
        showSuccess = getShowSuccess(options);
        trigger = getTrigger(options);
        showMessages = getShowMessages(options);
        inputEl = el[0].querySelector('.form-control[name]');
        inputNgEl = angular.element(inputEl);
        inputName = inputNgEl.attr('name');
        if (!inputName) {
          throw "show-errors element has no child input elements with a 'name' attribute and a 'form-control' class";
        }
        inputNgEl.bind(trigger, function() {
          blurred = true;
          return toggleClasses(formCtrl[inputName].$invalid);
        });
        scope.$watch(function() {
          return formCtrl[inputName] && formCtrl[inputName].$invalid;
        }, function(invalid) {
          if (!blurred) {
            return;
          }
          return toggleClasses(invalid);
        });
        scope.$on('show-errors-check-validity', function() {
          return toggleClasses(formCtrl[inputName].$invalid);
        });
        scope.$on('show-errors-reset', function() {
          return $timeout(function() {
            el.removeClass('has-error');
            el.removeClass('has-success');
            if (showMessages) {
              el.find('.se-field-message').hide();
            }
            return blurred = false;
          }, 0, false);
        });
        return toggleClasses = function(invalid) {
          el.toggleClass('has-error', invalid);
          if (showSuccess) {
            el.toggleClass('has-success', !invalid);
          }
          if (showMessages) {
            if (invalid) {
              el.find('.se-field-message').addClass('active');
              return el.find('.se-field-message').show();
            } else {
              el.find('.se-field-message').removeClass('active');
              return el.find('.se-field-message').hide();
            }
          }
        };
      };
      return {
        restrict: 'A',
        require: '^form',
        compile: function(elem, attrs) {
          if (!elem.hasClass('form-group')) {
            throw "show-errors element does not have the 'form-group' class";
          }
          return linkFn;
        }
      };
    }
  ]);

  showErrorsModule.provider('showErrorsConfig', function() {
    var _showMessages, _showSuccess, _trigger;
    _showSuccess = false;
    _trigger = 'blur';
    _showMessages = false;
    this.showSuccess = function(showSuccess) {
      return _showSuccess = showSuccess;
    };
    this.trigger = function(trigger) {
      return _trigger = trigger;
    };
    this.showMessages = function(showMessages) {
      return _showMessages = showMessages;
    };
    this.$get = function() {
      return {
        showSuccess: _showSuccess,
        trigger: _trigger,
        showMessages: _showMessages
      };
    };
  });

}).call(this);
