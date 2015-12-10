'use strict';

class AdminRegistration {
    constructor() {
        $('.btnAccept').on('click', (e) => { this.sendRequest($(e.currentTarget), 'accept'); });
        $('.btnRefuse').on('click', (e) => { this.sendRequest($(e.currentTarget), 'refuse'); });
        this._manageTable();
    }

    sendRequest($btn, reqType) {
        let dataUser = parseInt($btn.attr('data-user'), 10);
        if (isNaN(dataUser)) {
            return;
        }
        let $trUser = $(`#trUser${dataUser}`);
        $trUser.hide();
        reqType += 'Registration';
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                type: reqType,
                user: dataUser
            },
            success: () => {
                $trUser.remove();
                this._manageTable();
            },
            error: () => {
                $trUser.show();
            }
        });
    }

    // Private
    _manageTable() {
        if ($('#tablePendings tbody').find('tr').length === 0) {
            $('#tablePendings').hide();
            $('#successMsg').show();
        }
    }
}

$(document).ready(() => {
    new AdminRegistration();
});
