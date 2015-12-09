'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Registration = (function () {
    function Registration() {
        var _this = this;

        _classCallCheck(this, Registration);

        $('#btnSubmit').on('click', function (event) {
            _this.clickSubmit(event);
        });
        $('#username').on('blur', this.checkUsername);
        $('#password').on('keyup', this.checkPasswordStrength);
        $('#btnRefreshCaptcha').on('click', function () {
            _this.generateCaptcha();
        });

        // Captcha
        this.tabOpCaptcha = ['+', '-', 'x'];
        this.fNumCaptcha = '';
        this.sNumCaptcha = '';
        this.selectedOpCaptcha = '';
        this.generateCaptcha();
    }

    _createClass(Registration, [{
        key: 'clickSubmit',
        value: function clickSubmit(e) {
            e.preventDefault();
            this._removeError();
            this.checkUsername();
            $('#registerAlertError').hide();
            var tabErr = this._validForm();
            if (tabErr.length === 0) {
                this._sendRequest();
            } else {
                this._addError(tabErr);
            }
        }
    }, {
        key: 'checkUsername',
        value: function checkUsername() {
            var userName = $('#username').val();
            if (userName.length === 0) {
                return;
            }

            $.ajax({
                type: 'POST',
                url: $('#registrationForm').attr('action'),
                data: {
                    type: 'checkUsername',
                    username: userName
                },
                success: function success(response) {
                    if (!response.isExist) {
                        $('#username').addClass('form-control-success').removeClass('form-control-danger');
                        $('#formGpUsername').addClass('has-success').removeClass('has-danger');
                    } else {
                        $('#username').addClass('form-control-danger').removeClass('form-control-success');
                        $('#formGpUsername').addClass('has-danger').removeClass('has-success');
                    }
                }
            });
        }
    }, {
        key: 'checkPasswordStrength',
        value: function checkPasswordStrength() {
            var passWord = $('#password').val();
            var strengthPourcent = 0;
            var addPourcentComplete = 100 / 3;
            if (passWord.length >= 5) {
                strengthPourcent += addPourcentComplete;
            }

            if (passWord !== passWord.toLowerCase()) {
                strengthPourcent += addPourcentComplete;
            }

            // Find special chars
            var regexSpecialChars = '!@#$%^&*()+=-[]\';,./{}|":<>?~_';
            var hasSpecialChar = false;
            for (var i = 0; i < passWord.length; i++) {
                if (regexSpecialChars.indexOf(passWord[i]) !== -1) {
                    hasSpecialChar = true;
                    break;
                }
            }

            if (hasSpecialChar) {
                strengthPourcent += addPourcentComplete;
            }
            $('#passStrengthProgress').attr('value', strengthPourcent);
        }
    }, {
        key: 'generateCaptcha',
        value: function generateCaptcha() {
            var tmpIndex = Math.floor(Math.random() * 3 + 1);
            tmpIndex--;
            this.selectedOpCaptcha = this.tabOpCaptcha[tmpIndex];
            this.fNumCaptcha = Math.floor(Math.random() * 10 + 1);
            this.sNumCaptcha = Math.floor(Math.random() * 10 + 1);
            if (this.selectedOpCaptcha === '-') {
                // If the first number is lower than the second one we switch the numbers
                if (this.fNumCaptcha < this.sNumCaptcha) {
                    var tmp = this.fNumCaptcha;
                    this.fNumCaptcha = this.sNumCaptcha;
                    this.sNumCaptcha = tmp;
                }
            }

            // Update spans
            $('#firstNumberCaptcha').html(this.fNumCaptcha);
            $('#opCaptcha').html(this.selectedOpCaptcha);
            $('#secondNumberCaptcha').html(this.sNumCaptcha);
        }

        // Private

    }, {
        key: '_validForm',
        value: function _validForm() {
            var username = $('#username').val();
            var email = $('#email').val();
            var password = $('#password').val();
            var password2 = $('#password2').val();
            var tabErr = [];
            if (username.length === 0) {
                tabErr.push('#formGpUsername');
            }

            if (password.length === 0 || password !== password2) {
                tabErr.push('#formGpPassword');
            }

            var regexMail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if (email.length === 0 || !regexMail.test(email)) {
                tabErr.push('#formGpEmail');
            }

            if (!this._checkCaptchaResult()) {
                tabErr.push('#formGpCaptcha');
            }
            return tabErr;
        }
    }, {
        key: '_checkCaptchaResult',
        value: function _checkCaptchaResult() {
            var userResult = $('#inputCaptcha').val();
            if (userResult.length === 0) {
                return false;
            }

            userResult = parseInt(userResult, 10);
            if (isNaN(userResult)) {
                return false;
            }

            var result = 0;
            switch (this.selectedOpCaptcha) {
                case '+':
                    result = this.fNumCaptcha + this.sNumCaptcha;
                    break;
                case '-':
                    result = this.fNumCaptcha - this.sNumCaptcha;
                    break;
                case 'x':
                    result = this.fNumCaptcha * this.sNumCaptcha;
                    break;
                default:
                    result = this.fNumCaptcha + this.sNumCaptcha;
                    break;
            }

            return result === userResult;
        }
    }, {
        key: '_sendRequest',
        value: function _sendRequest() {
            var formData = this._getFormData();
            $('#btnSubmit').addClass('disabled');
            $('.own-loader').show();
            $.ajax({
                type: 'POST',
                url: $('#registrationForm').attr('action'),
                data: formData,
                success: this._registerSuccess,
                error: this._registerError
            });
        }
    }, {
        key: '_registerSuccess',
        value: function _registerSuccess(response) {
            $('.own-loader').hide();
            if (response.result) {
                $('#cardForm').remove();
                $('#registerAlertSuccess').show();
            } else {
                $('#btnSubmit').removeClass('disabled');
                $('#registerAlertError').show();
            }
        }
    }, {
        key: '_registerError',
        value: function _registerError() {
            $('.own-loader').hide();
            $('#btnSubmit').removeClass('disabled');
            $('#registerAlertError').show();
        }
    }, {
        key: '_getFormData',
        value: function _getFormData() {
            return {
                type: 'registration',
                login: $('#username').val(),
                email: $('#email').val(),
                password: $('#password').val()
            };
        }
    }, {
        key: '_addError',
        value: function _addError(tabError) {
            $(tabError).each(function (i) {
                $(tabError[i]).addClass('has-danger');
                $(tabError[i]).find('input').addClass('form-control-danger');
            });
        }
    }, {
        key: '_removeError',
        value: function _removeError() {
            $('.form-group.has-danger').removeClass('has-danger');
            $('.form-group.has-success').removeClass('has-success');
            $('input .form-control-danger').removeClass('form-control-danger');
            $('input .form-control-success').removeClass('form-control-success');
        }
    }]);

    return Registration;
})();

$(document).ready(function () {
    new Registration();
});
//# sourceMappingURL=register.js.map
