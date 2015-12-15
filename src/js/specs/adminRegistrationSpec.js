'use strict';

describe('adminRegistration.js', function () {
    var admin;
    beforeAll(function () {
        $(document).ready(function () {
            var templateHtml = [
                '<table id="tablePendings" class="table table-bordered table-striped" style="width: 700px;">',
                    '<tbody> </tbody>',
                '</table>',
                '<div id="successMsg" style="display: none;"></div>'
            ].join('');
            $('body').append(templateHtml);
            admin = new AdminRegistration();
        });
    });

    afterEach(function () {
        $('#successMsg').hide();
        $('#tablePendings').show();
        $('#tablePendings tbody').html('');
    });

    afterAll(function () {
        $('#tablePendings, #successMsg').remove();
        admin = null;
    });

    it('Test _manageTable()', function () {
        admin._manageTable();
        expect($('#tablePendings').css('display') === 'none').toBe(true);
        expect($('#successMsg').css('display') !== 'none').toBe(true);

        $('#tablePendings tbody').append('<tr></tr>');
        $('#successMsg').hide();
        $('#tablePendings').show();
        admin._manageTable();
        expect($('#tablePendings').css('display') !== 'none').toBe(true);
        expect($('#successMsg').css('display') === 'none').toBe(true);
    });
});
