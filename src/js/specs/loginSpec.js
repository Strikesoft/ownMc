'use strict';

describe('login.js', function () {
    var login;
    beforeAll(function () {
        $(document).ready(function () {
            var loginForm = [
                '<form id="loginForm">',
                    '<div id="formGpUsername" class="form-group row">',
                        '<input type="text" id="username" />',
                    '</div>',
                    '<div id="formGpPassword" class="form-group row">',
                        '<input type="password" id="password" />',
                    '</div>',
                    '<button type="submit" id="btnSubmit"></button>',
                '</form>'
            ].join('');
            $('body').append(loginForm);
            login = new Login();
        });
    });

    afterEach(function () {
        $('#username, #password').val('');
    });

    afterAll(function () {
        $('#loginForm').remove();
        login = null;
    });

    it('Test _validForm()', function () {
        var result = login._validForm();
        expect(result.length > 0).toBe(true);

        $('#password').val('test');
        result = login._validForm();
        expect(result.length === 1).toBe(true);

        $('#username').val('Johann-S');
        result = login._validForm();
        expect(result.length === 0).toBe(true);
    });

    it('Test _addError()', function () {
        login._addError([
            '#formGpUsername',
            '#formGpPassword'
        ]);

        expect($('#formGpUsername').hasClass('has-danger')).toBe(true);
        expect($('#formGpPassword').hasClass('has-danger')).toBe(true);
    });

    it('Test _removeError()', function () {
        login._addError([
            '#formGpUsername',
            '#formGpPassword'
        ]);
        login._removeError();

        expect($('#formGpUsername').hasClass('has-danger')).toBe(false);
        expect($('#formGpPassword').hasClass('has-danger')).toBe(false);
    });
});
