'use strict';

class Folders {
    constructor() {
        $('#selectExt, #editSelectExt').chosen({
            width: '100%',
            no_results_text: 'Not found'
        });
        $('#btnAddFolder').on('click', () => { this.addFolder(); });
        $('#btnEditFolder').on('click', () => { this.editFolder(); });
        $('#btnRemoveFolder').on('click', () => { this.removeFolder(); });
        $('#addFolderModal').on('hidden.bs.modal', () => { this.onHiddenAddModal(); });
        $('#editFolderModal').on('hidden.bs.modal', () => { this.onHiddenEditModal(); });
        $('#removeFolderModal').on('hidden.bs.modal', () => { $('#alertErrorRemoveFolder').hide(); });
        this._bindClickOnActionBtn();
        this.xhrAdd = null;
        this.xhrRefresh = null;
        this.xhrEdit = null;
    }

    addFolder() {
        this._clearAlertResult('#alertResult');
        $('.form-group.has-danger').removeClass('has-danger');
        let tabError = this._checkAddFolderForm();
        if (tabError.length > 0) {
            this._addError(tabError);
            return;
        }
        let nameFolder = $('#folderName').val();
        let pathFolder = $('#folderPath').val();
        let extAllowed = $('#selectExt').val();
        this._showLoader('add');
        let that = this;
        this.xhrAdd = $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                type: 'addFolder',
                name: nameFolder,
                path: pathFolder,
                extensions: extAllowed
            },
            success: (data) => {
                that.xhrAdd = null;
                that._setResult('#alertResult', data.result, data.message);
                that._hideLoader('add');
                if (data.result !== 'error') {
                    that.clearModalForm('add');
                    that._refreshFolderTable();
                }
            }
        });
    }

    displayRemoveModalFolder($btn) {
        let idFolder = $btn.attr('data-folder');
        $('#inputRemoveFolder').val(idFolder);
        $('#removeFolderModal').modal('show');
    }

    displayEditModalFolder($btn) {
        let idFolder = $btn.attr('data-folder');
        $('#inputEditFolder').val(idFolder);
        $('#formEditFolder').hide();
        this._showLoader('edit');
        $('#editFolderModal').modal('show');
        let that = this;
        $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                type: 'infoFolder',
                folder: idFolder
            },
            success: (data) => {
                that._hideLoader('edit');
                if (data.result !== undefined && data.result === 'error') {
                    $('#alertEditDisplay').show();
                }
                else {
                    $('#editFolderName').val(data.name);
                    $('#editFolderPath').val(data.path);
                    for (let index in data.extensions) {
                        if ({}.hasOwnProperty.call(data.extensions, index)) {
                            let extension = data.extensions[index].toLowerCase();
                            $(`#editSelectExt option[value="${extension}"]`).prop('selected', true);
                        }
                    }
                    $('#editSelectExt').trigger('chosen:updated');
                    $('#formEditFolder').show();
                }
            }
        });
    }

    editFolder() {
        this._clearAlertResult('#alertEditResult');
        $('.form-group.has-danger').removeClass('has-danger');
        let idFolder = $('#inputEditFolder').val();
        let nameFolder = $('#editFolderName').val();
        let pathFolder = $('#editFolderPath').val();
        let extAllowed = $('#editSelectExt').val();
        let tabError = this._checkEditFolderForm();
        if (tabError.length > 0) {
            this._addError(tabError);
            return;
        }
        this._showLoader('edit');
        let that = this;
        this.xhrEdit = $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                type: 'editFolder',
                folderId: idFolder,
                name: nameFolder,
                path: pathFolder,
                extensions: extAllowed
            },
            success: (data) => {
                that.xhrEdit = null;
                that._setResult('#alertEditResult', data.result, data.message);
                that._hideLoader('edit');
                if (data.result !== 'error') {
                    that.clearModalForm('edit');
                    that._refreshFolderTable();
                    $('#editFolderModal').modal('hide');
                }
            }
        });
    }

    removeFolder() {
        let idFolder = $('#inputRemoveFolder').val();
        let $tr = $(`#tr${idFolder}`);
        $tr.hide();
        $('#alertErrorRemoveFolder').hide();
        this._showLoader('remove');
        this.xhrAdd = $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                type: 'removeFolder',
                folder: idFolder
            },
            success: (data) => {
                this._hideLoader('remove');
                if (data.result === 'success') {
                    $tr.remove();
                    $('#removeFolderModal').modal('hide');
                }
                else {
                    $tr.show();
                    $('#alertErrorRemoveFolder').show();
                }
            }
        });
    }

    clearModalForm(type) {
        if (type === 'add') {
            $('#folderName, #folderPath, #selectExt').val('');
            $('#selectExt').trigger('chosen:updated');
        }
        else {
            $('#editFolderName, #editFolderPath, #editSelectExt').val('');
            $('#editSelectExt').trigger('chosen:updated');
        }
    }

    onHiddenAddModal() {
        this.clearModalForm('add');
        this._clearAlertResult('#alertResult');
        this._hideLoader('add');
        if (this.xhrAdd !== null) {
            this.xhrAdd.abort();
        }
    }

    onHiddenEditModal() {
        this.clearModalForm('edit');
        this._hideLoader('edit');
        this._clearAlertResult('#alertEditResult');
        $('#formEditFolder, #alertEditDisplay, #alertEditResult').hide();
        if (this.xhrEdit !== null) {
            this.xhrEdit.abort();
        }
    }

    // private
    _checkAddFolderForm() {
        let nameFolder = $('#folderName').val();
        let pathFolder = $('#folderPath').val();
        let allowedExt = $('#selectExt').val();
        let tabFormGroup = [];
        if (nameFolder.length === 0) {
            tabFormGroup.push('#formGrpFolderName');
        }
        if (pathFolder.length === 0) {
            tabFormGroup.push('#formGrpFolderPath');
        }
        if (allowedExt === null) {
            tabFormGroup.push('#formGrpFolderExt');
        }
        return tabFormGroup;
    }

    _checkEditFolderForm() {
        let nameFolder = $('#editFolderName').val();
        let pathFolder = $('#editFolderPath').val();
        let allowedExt = $('#editSelectExt').val();
        let tabFormGroup = [];
        if (nameFolder.length === 0) {
            tabFormGroup.push('#formGrpEditFolderName');
        }
        if (pathFolder.length === 0) {
            tabFormGroup.push('#formGrpEditFolderPath');
        }
        if (allowedExt === null) {
            tabFormGroup.push('#formGrpEditFolderExt');
        }
        return tabFormGroup;
    }

    _bindClickOnActionBtn() {
        $('.btnRemoveFolder').off('click')
            .on('click', (e) => { this.displayRemoveModalFolder($(e.currentTarget)); });
        $('.btnEditFolder').off('click')
            .on('click', (e) => { this.displayEditModalFolder($(e.currentTarget)); });
    }

    _addError(tabError) {
        $(tabError).each((i) => {
            $(tabError[i]).addClass('has-danger');
        });
    }

    _setResult(idAlert, type, message) {
        let $alert = $(idAlert);
        if ($alert.length === 0) {
            throw new Error('#alertResult don\'t exist');
        }
        let alertCssClass = (type === 'error') ? 'alert-danger' : 'alert-success';
        $alert.addClass(alertCssClass);
        $alert.find('p').html(message);
        $alert.show();
    }

    _clearAlertResult(id) {
        let $alert = $(id);
        if ($alert.length === 0) {
            throw new Error('#alertResult don\'t exist');
        }
        $alert.removeClass('alert-danger').removeClass('alert-success');
        $alert.find('p').html('');
        $alert.hide();
    }

    _showLoader(type) {
        if (type === 'add') {
            $('#loaderAddFolder').show();
            $('#btnAddFolder, #btnCloseAddModal').addClass('disabled');
        }
        else if (type === 'remove') {
            $('#loaderRemoveFolder').show();
            $('#btnRemoveFolder, #btnCloseRemoveModal').addClass('disabled');
        }
        else {
            $('#loaderEditFolder').show();
            $('#btnEditFolder, #btnCloseEditModal').addClass('disabled');
        }
    }

    _hideLoader(type) {
        if (type === 'add') {
            $('#loaderAddFolder').hide();
            $('#btnAddFolder, #btnCloseAddModal').removeClass('disabled');
        }
        else if (type === 'remove') {
            $('#loaderRemoveFolder').hide();
            $('#btnRemoveFolder, #btnCloseRemoveModal').removeClass('disabled');
        }
        else {
            $('#loaderEditFolder').hide();
            $('#btnEditFolder, #btnCloseEditModal').removeClass('disabled');
        }
    }

    _refreshFolderTable() {
        let $tableBody = $('#tableFolder').find('tbody');
        if ($tableBody.length === 0) {
            return;
        }
        // Abort if a refresh request is in progress
        if (this.xhrRefresh !== null) {
            this.xhrRefresh.abort();
        }
        $tableBody.html(''); // reset table body
        let that = this;
        this.xhrRefresh = $.ajax({
            type: 'POST',
            url: window.location.href,
            data: {
                type: 'getFolders'
            },
            success: (data) => {
                $tableBody.html(data);
                that._bindClickOnActionBtn();
            }
        });
    }
}

$(document).ready(() => {
    new Folders();
});
