// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
(function ($, window, document, undefined) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "psswrdStrngth",
        defaults = {
            minAmounts: {
                'upperCase': 1,
                'lowerCase': 1,
                'numbers': 1,
                'specialChars': 1
            },
            classes: {
                'upperCase': 'uppercase',
                'lowerCase': 'lowercase',
                'numbers': 'numbers',
                'specialChars': 'specialchars',
                'length': 'length',
                'valid': 'valid',
                'invalid': 'invalid'
            },
            minLength: 8
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend(true, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        this.regexList = {
            'upperCase': new RegExp('[A-Z]', 'g'),
            'lowerCase': new RegExp('[a-z]', 'g'),
            'numbers': new RegExp('[0-9]', 'g'),
            'specialChars': new RegExp('([!,",#,$,%,&,\\[,\\],(,),\\,,*,+,-,.,/,:,;,<,=,>,?,@,^,_,`,{,|,},~,\\\\])', 'g')
        };

        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            var $this = this;
            var $element = $(this.element);

            $this.prepareAmounts();
            $this.runValidations($element);


            $element.keyup(function () {
                $this.runValidations($element);
            });
        },
        runValidations: function($element) {

            var $val = $element.val();
            var $this = this;
            var $validations = {};

            $validations['length'] = ($this.validateLength($val));

            $.each($this.getRegexList(), function (key, value) {
                $validations[key] = $this.validateRegex(key, $val);
            });

            $this.parseValidations($validations);
        },
        getRegexList: function () {
            return this.regexList;
        },
        validateLength: function (value) {
            return value.length >= this.settings.minLength;
        },
        validateRegex: function (regexName, value) {
            var $regex = this.getRegexList()[regexName];
            var $match = value.match($regex);

            if(this.settings.minAmounts[regexName] === 0) {
                return true;
            }

            if ($match === null || typeof $match.length === 'undefined') {
                return false;
            }
            return value.match($regex).length >= this.settings.minAmounts[regexName];
        },
        parseValidations: function ($validations) {
            var $this = this;
            var $valid = $this.getValidationClass('valid');
            var $invalid = $this.getValidationClass('invalid');

            $.each($validations, function (validation, result) {
                var $element = $("." + $this.getValidationClass(validation));
                if($this.settings.minAmounts[validation] === 0) {
                    $element.hide();
                }
                $element.removeClass($valid + " " + $invalid);
                if (result === true) {
                    $element.addClass($valid);
                } else {
                    $element.addClass($invalid);
                }
            });
        },
        getValidationClass: function (validation) {
            return this.settings.classes[validation];
        },
        prepareAmounts: function() {
            var $this = this;
            $this.writeAmount('length', $this.settings.minLength);
            $.each($this.settings.minAmounts, function (key, value) {
                $this.writeAmount(key, value);
            });
        },
        writeAmount: function(key, value) {
            $("." + this.getValidationClass(key) + " span.amount").html(value);
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);