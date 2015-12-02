'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Registration = (function () {
    function Registration() {
        _classCallCheck(this, Registration);

        var that = this;
        $('#btnSubmit').on('click', function (event) {
            that.clickSubmit(event);
        });
    }

    _createClass(Registration, [{
        key: 'clickSubmit',
        value: function clickSubmit(e) {
            e.preventDefault();
            this._removeError();
            $('#registerAlertError').hide();
            var tabErr = this._validForm();
            if (tabErr.length === 0) {
                this._sendRequest();
            } else {
                this._addError(tabErr);
            }
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

            // TODO: force length of password and add indication about the strengh
            if (password.length === 0 || password !== password2) {
                tabErr.push('#formGpPassword');
            }

            var regexMail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if (email.length === 0 || !regexMail.test(email)) {
                tabErr.push('#formGpEmail');
            }
            return tabErr;
        }
    }, {
        key: '_sendRequest',
        value: function _sendRequest() {
            var formData = this._getFormData();
            var that = this;
            $('#btnSubmit').addClass('disabled');
            $('.own-loader').show();
            $.ajax({
                type: 'POST',
                url: $('#registrationForm').attr('action'),
                data: formData,
                success: that._registerSuccess,
                error: that._registerError
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
            });
        }
    }, {
        key: '_removeError',
        value: function _removeError() {
            $('.form-group.has-danger').removeClass('has-danger');
        }
    }]);

    return Registration;
})();

$(document).ready(function () {
    new Registration();
});
//# sourceMappingURL=register.js.map
