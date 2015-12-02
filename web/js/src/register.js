'use strict';

class Registration {
    constructor() {
        let that = this;
        $('#btnSubmit').on('click', (event) => { that.clickSubmit(event); });
        $('#username').on('blur', that.checkUsername);
    }

    clickSubmit(e) {
        e.preventDefault();
        this._removeError();
        this.checkUsername();
        $('#registerAlertError').hide();
        let tabErr = this._validForm();
        if (tabErr.length === 0) {
            this._sendRequest();
        }
        else {
            this._addError(tabErr);
        }
    }

    checkUsername() {
        let userName = $('#username').val();
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
            success: (response) => {
                if (!response.isExist) {
                    $('#username').addClass('form-control-success')
                                  .removeClass('form-control-danger');
                    $('#formGpUsername').addClass('has-success')
                                        .removeClass('has-danger');
                }
                else {
                    $('#username').addClass('form-control-danger')
                                  .removeClass('form-control-success');
                    $('#formGpUsername').addClass('has-danger')
                                        .removeClass('has-success');
                }
            }
        });
    }

    // Private
    _validForm() {
        let username = $('#username').val();
        let email = $('#email').val();
        let password = $('#password').val();
        let password2 = $('#password2').val();
        let tabErr = [];
        if (username.length === 0) {
            tabErr.push('#formGpUsername');
        }

        // TODO: force length of password and add indication about the strengh
        if (password.length === 0 || password !== password2) {
            tabErr.push('#formGpPassword');
        }

        let regexMail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        if (email.length === 0 || !regexMail.test(email)) {
            tabErr.push('#formGpEmail');
        }
        return tabErr;
    }

    _sendRequest() {
        let formData = this._getFormData();
        let that = this;
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

    _registerSuccess(response) {
        $('.own-loader').hide();
        if (response.result) {
            $('#cardForm').remove();
            $('#registerAlertSuccess').show();
        }
        else {
            $('#btnSubmit').removeClass('disabled');
            $('#registerAlertError').show();
        }
    }

    _registerError() {
        $('.own-loader').hide();
        $('#btnSubmit').removeClass('disabled');
        $('#registerAlertError').show();
    }

    _getFormData() {
        return {
            type: 'registration',
            login: $('#username').val(),
            email: $('#email').val(),
            password: $('#password').val()
        };
    }

    _addError(tabError) {
        $(tabError).each((i) => {
            $(tabError[i]).addClass('has-danger');
        });
    }

    _removeError() {
        $('.form-group.has-danger').removeClass('has-danger');
        $('.form-group.has-success').removeClass('has-success');
        $('input .form-control-danger').removeClass('form-control-danger');
        $('input .form-control-success').removeClass('form-control-success');
    }
}

$(document).ready(() => {
    new Registration();
});
