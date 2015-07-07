/*
 *  jquery-password-requirement-checker - v1.0.6
 *  A jQuery plugin to check if a password complies to certain requirements.
 *  https://theconceptstore.nl
 *
 *  Made by Tijs van Erp
 *  Under MIT License
 */
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
                "amount": "amount",
                "dirty": "dirty",
                "active": "active",
                "showInvalidFields": "show-invalid-fields"

            },
            elementWrapperName: ".password-req-checker",
            formGroupName: ".form-group",
            minLength: 8
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.wrapper = $(this.element).closest("form").find(defaults.elementWrapperName);
        this.formGroup = $(this.element).parent(defaults.formGroupName);
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
            var $this = this,
                element = $(this.element),
                wrapper = $(this.wrapper),
                formGroup = $(this.formGroup);

            $this.prepareAmounts();
            $this.runValidations(element);

            element.keyup(function () {
                $this.runValidations(element);

                // Show/hide icons in the password requirement checker
                if(element.val().length !== 0) {
                    wrapper.addClass($this.settings.classes.dirty);
                } else {
                    wrapper.removeClass($this.settings.classes.dirty);
                }
            });

            // Setup visibility of the password requirement checker and remove the blur classes
            element.focus(function() {
                wrapper.removeClass($this.settings.classes.showInvalidFields).addClass($this.settings.classes.active);

                // Hide validation indicator while the input field is active
                formGroup.removeClass($this.settings.classes.invalid + " " + $this.settings.classes.valid);
            });

            element.blur(function() {
                wrapper.removeClass($this.settings.classes.active);
                formGroup.removeClass($this.settings.classes.invalid).addClass($this.settings.classes.valid);

                if(!$this.runValidations(element)) {
                    formGroup
                        .removeClass($this.settings.classes.valid)
                        .addClass($this.settings.classes.invalid);

                    wrapper.addClass($this.settings.classes.showInvalidFields);
                }
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

            return $this.parseValidations(validations);
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
            var validationsResult = true;

            $.each(validations, function (validation, result) {
                var element = $("." + $this.getValidationClass(validation));
                if($this.settings.minAmounts[validation] === 0) {
                    element.hide();
                }
                element.removeClass(validClass + " " + invalidClass);
                if (result === true) {
                    element.addClass(validClass);
                } else {
                    validationsResult = false;
                    element.addClass(invalidClass);
                }
            });

            return validationsResult;
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