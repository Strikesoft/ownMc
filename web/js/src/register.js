'use strict';

class Registration {
    constructor() {
        let that = this;
        $('#btnSubmit').on('click', (event) => { that.clickSubmit(event); });
        $('#username').on('blur', that.checkUsername);
        $('#password').on('keyup', that.checkPasswordStrength);
        $('#btnRefreshCaptcha').on('click', () => { that.generateCaptcha(); });

        // Captcha
        this.tabOpCaptcha = ['+', '-', 'x'];
        this.fNumCaptcha = '';
        this.sNumCaptcha = '';
        this.selectedOpCaptcha = '';
        this.generateCaptcha();
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

    checkPasswordStrength() {
        let passWord = $('#password').val();
        let strengthPourcent = 0;
        let addPourcentComplete = 100 / 3;
        if (passWord.length >= 5) {
            strengthPourcent += addPourcentComplete;
        }

        if (passWord !== passWord.toLowerCase()) {
            strengthPourcent += addPourcentComplete;
        }

        // Find special chars
        let regexSpecialChars = '!@#$%^&*()+=-[]\';,./{}|":<>?~_';
        let hasSpecialChar = false;
        for (let i = 0; i < passWord.length; i++) {
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

    generateCaptcha() {
        let tmpIndex = Math.floor((Math.random() * 3) + 1);
        tmpIndex--;
        this.selectedOpCaptcha = this.tabOpCaptcha[tmpIndex];
        this.fNumCaptcha = Math.floor((Math.random() * 10) + 1);
        this.sNumCaptcha = Math.floor((Math.random() * 10) + 1);
        if (this.selectedOpCaptcha === '-') {
            // If the first number is lower than the second one we switch the numbers
            if (this.fNumCaptcha < this.sNumCaptcha) {
                let tmp = this.fNumCaptcha;
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
    _validForm() {
        let username = $('#username').val();
        let email = $('#email').val();
        let password = $('#password').val();
        let password2 = $('#password2').val();
        let tabErr = [];
        if (username.length === 0) {
            tabErr.push('#formGpUsername');
        }

        if (password.length === 0 || password !== password2) {
            tabErr.push('#formGpPassword');
        }

        let regexMail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        if (email.length === 0 || !regexMail.test(email)) {
            tabErr.push('#formGpEmail');
        }

        if (!this._checkCaptchaResult()) {
            tabErr.push('#formGpCaptcha');
        }
        return tabErr;
    }

    _checkCaptchaResult() {
        let userResult = $('#inputCaptcha').val();
        if (userResult.length === 0) {
            return false;
        }

        userResult = parseInt(userResult, 10);
        if (isNaN(userResult)) {
            return false;
        }

        let result = 0;
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
            $(tabError[i]).find('input').addClass('form-control-danger');
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
