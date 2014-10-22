showErrorsModule = angular.module('ui.bootstrap.showErrors', [])

showErrorsModule.directive 'showErrors',
['$timeout', 'showErrorsConfig', ($timeout, showErrorsConfig) ->
    
    getTrigger = (options) ->
      trigger = showErrorsConfig.trigger
      if options && options.trigger?
        trigger = options.trigger
      trigger
    
    getShowSuccess = (options) ->
      showSuccess = showErrorsConfig.showSuccess
      if options && options.showSuccess?
        showSuccess = options.showSuccess
      showSuccess

    getShowMessages = (options) ->
      showMessages = showErrorsConfig.showMessages
      if options && options.showMessages?
        showMessages = options.showMessages
      showMessages

    linkFn = (scope, el, attrs, formCtrl) ->
      blurred = false
      options = scope.$eval attrs.showErrors
      showSuccess = getShowSuccess options
      trigger = getTrigger options
      showMessages = getShowMessages options

      inputEl   = el[0].querySelector '.form-control[name]'
      inputNgEl = angular.element inputEl
      inputName = inputNgEl.attr 'name'
      unless inputName
        throw "show-errors element has no child input elements with a 'name' attribute and a 'form-control' class"

      inputNgEl.bind trigger, ->
        blurred = true
        toggleClasses formCtrl[inputName].$invalid

      scope.$watch ->
        formCtrl[inputName] && formCtrl[inputName].$invalid
      , (invalid) ->
        return if !blurred
        toggleClasses invalid

      scope.$on 'show-errors-check-validity', ->
        toggleClasses formCtrl[inputName].$invalid

      scope.$on 'show-errors-reset', ->
        $timeout ->
          # want to run this after the current digest cycle
          el.removeClass 'has-error'
          el.removeClass 'has-success'
          if showMessages
            el.find('.se-field-message').hide()
          blurred = false
        , 0, false

      toggleClasses = (invalid) ->
        el.toggleClass 'has-error', invalid
        if showSuccess
          el.toggleClass 'has-success', !invalid
        if showMessages
          if invalid
            el.find('.se-field-message').addClass('active')
            el.find('.se-field-message').show()
          else
            el.find('.se-field-message').removeClass('active')
            el.find('.se-field-message').hide()

    {
      restrict: 'A'
      require: '^form'
      compile: (elem, attrs) ->
        unless elem.hasClass 'form-group'
          throw "show-errors element does not have the 'form-group' class"
        linkFn
    }
]

showErrorsModule.provider 'showErrorsConfig', ->
  _showSuccess = false
  _trigger = 'blur'
  _showMessages = false

  @showSuccess = (showSuccess) ->
    _showSuccess = showSuccess
    
  @trigger = (trigger) ->
    _trigger = trigger

  @showMessages = (showMessages) ->
    _showMessages = showMessages

  @$get = ->
    showSuccess: _showSuccess
    trigger: _trigger
    showMessages: _showMessages

  return
