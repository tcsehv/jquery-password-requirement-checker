# jQuery password requirements checker [![Build Status](https://travis-ci.org/tcsehv/jquery-password-requirement-checker.svg?branch=master)](https://travis-ci.org/tcsehv/jquery-password-requirement-checker)

Demo: [http://jsfiddle.net/tijsvanerp/L8bg35wa/1/](http://jsfiddle.net/tijsvanerp/L8bg35wa/1/)

A jQuery to plugin to validate if a password meets certain requirements. Some organisations still use password policies that 
are based on the usage of certain characters in passwords instead of requiring a certain complexity. 
This plugin checks for the usage of those characters. 

## Installation
Installation with bower:
```
$ bower install jquery-password-requirement-checker
```

Installation with NPM:
```
$ npm i jquery-password-requirement-checker
```

## Usage

```html
<input type="text" name="password" id="password" value="">
<h4>Password must meet the following requirements:</h4>
<ul>
    <li class="invalid lowercase">At least <strong><span class="amount"></span> character</strong></li>
    <li class="invalid uppercase">At least <strong><span class="amount"></span> upper case character</strong></li>
    <li class="invalid numbers">At least <strong><span class="amount"></span> number</strong></li>
    <li class="invalid specialchars">At least <strong><span class="amount"></span> special character</strong></li>
    <li class="invalid length">Be at least <strong><span class="amount"></span> characters</strong></li>
</ul>
<script src="dist/jquery.password-requirements-checker.js"></script>
```
```javascript
<script>
    $(document).ready(function() {
        $("#password").passwordRequirements();
    });
</script>
```

All settings within the plugin can be set as an option:
```javascript
<script>
    $(document).ready(function() {
        $("#password").passwordRequirements({
            minLength: 12,
            minAmounts: {
                specialChars: 3
            }
        });
    });
</script>
```