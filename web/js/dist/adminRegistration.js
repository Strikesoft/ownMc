'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AdminRegistration = (function () {
    function AdminRegistration() {
        var _this = this;

        _classCallCheck(this, AdminRegistration);

        $('.btnAccept').on('click', function (e) {
            _this.sendRequest($(e.currentTarget), 'accept');
        });
        $('.btnRefuse').on('click', function (e) {
            _this.sendRequest($(e.currentTarget), 'refuse');
        });
        this._manageTable();
    }

    _createClass(AdminRegistration, [{
        key: 'sendRequest',
        value: function sendRequest($btn, reqType) {
            var _this2 = this;

            var dataUser = parseInt($btn.attr('data-user'), 10);
            if (isNaN(dataUser)) {
                return;
            }
            var $trUser = $('#trUser' + dataUser);
            $trUser.hide();
            reqType += 'Registration';
            $.ajax({
                type: 'POST',
                url: window.location.href,
                data: {
                    type: reqType,
                    user: dataUser
                },
                success: function success() {
                    $trUser.remove();
                    _this2._manageTable();
                },
                error: function error() {
                    $trUser.show();
                }
            });
        }

        // Private

    }, {
        key: '_manageTable',
        value: function _manageTable() {
            if ($('#tablePendings tbody').find('tr').length === 0) {
                $('#tablePendings').hide();
                $('#successMsg').show();
            }
        }
    }]);

    return AdminRegistration;
})();

$(document).ready(function () {
    new AdminRegistration();
});
//# sourceMappingURL=adminRegistration.js.map
