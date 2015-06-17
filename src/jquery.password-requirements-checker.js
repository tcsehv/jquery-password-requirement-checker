(function ($, window, document, undefined) {

    "use strict";

    // Create the defaults once
    var pluginName = "passwordRequirements",
        defaults = {
            minAmounts: {
                "upperCase": 1,
                "lowerCase": 1,
                "numbers": 1,
                "specialChars": 1
            },
            classes: {
                "upperCase": "uppercase",
                "lowerCase": "lowercase",
                "numbers": "numbers",
                "specialChars": "specialchars",
                "length": "length",
                "valid": "valid",
                "invalid": "invalid",
                "amount": "amount"
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
            "upperCase": new RegExp("[A-Z]", "g"),
            "lowerCase": new RegExp("[a-z]", "g"),
            "numbers": new RegExp("[0-9]", "g"),
            "specialChars": new RegExp("([!,\",#,$,%,&,\\[,\\],(,),\\,,*,+,-,.,/,:,;,<,=,>,?,@,^,_,`,{,|,},~,\\\\])", "g")
        };

        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, {
        init: function () {
            var $this = this;
            var element = $(this.element);

            $this.prepareAmounts();
            $this.runValidations(element);

            element.keyup(function () {
                $this.runValidations(element);
            });
        },
        runValidations: function(element) {

            var fieldValue = element.val();
            var $this = this;
            var validations = {};

            validations.length = $this.validateLength(fieldValue);

            $.each($this.getRegexList(), function (key, value) {
                validations[key] = $this.validateRegex(key, value, fieldValue);
            });

            $this.parseValidations(validations);
        },
        getRegexList: function () {
            return this.regexList;
        },
        validateLength: function (value) {
            return value.length >= this.settings.minLength;
        },
        validateRegex: function (regexName, regex, value) {
            var match = value.match(regex);

            if(this.settings.minAmounts[regexName] === 0) {
                return true;
            }

            if (match === null || typeof match.length === "undefined") {
                return false;
            }
            return value.match(regex).length >= this.settings.minAmounts[regexName];
        },
        parseValidations: function (validations) {
            var $this = this;
            var validClass = $this.getValidationClass("valid");
            var invalidClass = $this.getValidationClass("invalid");

            $.each(validations, function (validation, result) {
                var element = $("." + $this.getValidationClass(validation));
                if($this.settings.minAmounts[validation] === 0) {
                    element.hide();
                }
                element.removeClass(validClass + " " + invalidClass);
                if (result === true) {
                    element.addClass(validClass);
                } else {
                    element.addClass(invalidClass);
                }
            });
        },
        getValidationClass: function (validation) {
            return this.settings.classes[validation];
        },
        prepareAmounts: function() {
            var $this = this;
            $this.writeAmount("length", $this.settings.minLength);
            $.each($this.settings.minAmounts, function (key, value) {
                $this.writeAmount(key, value);
            });
        },
        writeAmount: function(key, value) {
            $("." + this.getValidationClass(key) + " ." + this.getValidationClass("amount")).html(value);
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