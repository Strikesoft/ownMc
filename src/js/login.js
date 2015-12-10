'use strict';

class Login {
    constructor() {
        let that = this;
        $('#btnSubmit').on('click', (event) => { that.clickSubmit(event); });
    }

    clickSubmit(e) {
        e.preventDefault();
        this._removeError();
        let tabErr = this._validForm();
        if (tabErr.length === 0) {
            $('#loginForm').submit();
        }
        else {
            this._addError(tabErr);
        }
    }

    // Private
    _validForm() {
        let username = $('#username').val();
        let password = $('#password').val();
        let tabErr = [];
        if (username.length === 0) {
            tabErr.push('#formGpUsername');
        }

        if (password.length === 0) {
            tabErr.push('#formGpPassword');
        }
        return tabErr;
    }

    _addError(tabError) {
        $(tabError).each((i) => {
            $(tabError[i]).addClass('has-danger');
        });
    }

    _removeError() {
        $('.form-group.has-danger').removeClass('has-danger');
    }
}

$(document).ready(() => {
    new Login();
});
