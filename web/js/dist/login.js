'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Login = (function () {
    function Login() {
        _classCallCheck(this, Login);

        var that = this;
        $('#btnSubmit').on('click', function (event) {
            that.clickSubmit(event);
        });
    }

    _createClass(Login, [{
        key: 'clickSubmit',
        value: function clickSubmit(e) {
            e.preventDefault();
            this._removeError();
            var tabErr = this._validForm();
            if (tabErr.length === 0) {
                $('#loginForm').submit();
            } else {
                this._addError(tabErr);
            }
        }

        // Private

    }, {
        key: '_validForm',
        value: function _validForm() {
            var username = $('#username').val();
            var password = $('#password').val();
            var tabErr = [];
            if (username.length === 0) {
                tabErr.push('#formGpUsername');
            }

            if (password.length === 0) {
                tabErr.push('#formGpPassword');
            }
            return tabErr;
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

    return Login;
})();

$(document).ready(function () {
    new Login();
});
//# sourceMappingURL=login.js.map
