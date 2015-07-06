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

## Base styling
Please include 'base-styling.css' (See dist/css/base-styling.css) inside the head-tags of the HTML to add the necessary display classes (and icons) to the elements. We've included a SASS-file/Grunt setup if more styling customization is needed.

## Usage

```html
<form>
    <div class="form-group">
        <label for="password">Password</label>
        <input type="password" name="password" id="password" value="">
    </div>
    <div class="password-req-checker">
        <h4>Password must meet the following requirements:</h4>
        <ul>
            <li class="invalid lowercase">At least <strong><span class="amount">1</span> lower case character(s)</strong></li>
            <li class="invalid uppercase">At least <strong><span class="amount">1</span> upper case character(s)</strong></li>
            <li class="invalid numbers">At least <strong><span class="amount">1</span> number(s)</strong></li>
            <li class="invalid specialchars">At least <strong><span class="amount">1</span> special character(s)</strong></li>
            <li class="invalid length">At least <strong><span class="amount">8</span> total characters</strong></li>
        </ul>
    </div>
</form>
<script src="dist/js/jquery.password-requirements-checker.min.js"></script>
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