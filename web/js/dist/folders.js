'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Folders = (function () {
    function Folders() {
        var _this = this;

        _classCallCheck(this, Folders);

        $('#selectExt, #editSelectExt').chosen({
            width: '100%',
            no_results_text: 'Not found'
        });
        $('#btnAddFolder').on('click', function () {
            _this.addFolder();
        });
        $('#btnEditFolder').on('click', function () {
            _this.editFolder();
        });
        $('#btnRemoveFolder').on('click', function () {
            _this.removeFolder();
        });
        $('#addFolderModal').on('hidden.bs.modal', function () {
            _this.onHiddenAddModal();
        });
        $('#editFolderModal').on('hidden.bs.modal', function () {
            _this.onHiddenEditModal();
        });
        $('#removeFolderModal').on('hidden.bs.modal', function () {
            $('#alertErrorRemoveFolder').hide();
        });
        this._bindClickOnActionBtn();
        this.xhrAdd = null;
        this.xhrRefresh = null;
        this.xhrEdit = null;
    }

    _createClass(Folders, [{
        key: 'addFolder',
        value: function addFolder() {
            this._clearAlertResult('#alertResult');
            $('.form-group.has-danger').removeClass('has-danger');
            var tabError = this._checkAddFolderForm();
            if (tabError.length > 0) {
                this._addError(tabError);
                return;
            }
            var nameFolder = $('#folderName').val();
            var pathFolder = $('#folderPath').val();
            var extAllowed = $('#selectExt').val();
            this._showLoader('add');
            var that = this;
            this.xhrAdd = $.ajax({
                type: 'POST',
                url: window.location.href,
                data: {
                    type: 'addFolder',
                    name: nameFolder,
                    path: pathFolder,
                    extensions: extAllowed
                },
                success: function success(data) {
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
    }, {
        key: 'displayRemoveModalFolder',
        value: function displayRemoveModalFolder($btn) {
            var idFolder = $btn.attr('data-folder');
            $('#inputRemoveFolder').val(idFolder);
            $('#removeFolderModal').modal('show');
        }
    }, {
        key: 'displayEditModalFolder',
        value: function displayEditModalFolder($btn) {
            var idFolder = $btn.attr('data-folder');
            $('#inputEditFolder').val(idFolder);
            $('#formEditFolder').hide();
            this._showLoader('edit');
            $('#editFolderModal').modal('show');
            var that = this;
            $.ajax({
                type: 'POST',
                url: window.location.href,
                data: {
                    type: 'infoFolder',
                    folder: idFolder
                },
                success: function success(data) {
                    that._hideLoader('edit');
                    if (data.result !== undefined && data.result === 'error') {
                        $('#alertEditDisplay').show();
                    } else {
                        $('#editFolderName').val(data.name);
                        $('#editFolderPath').val(data.path);
                        for (var index in data.extensions) {
                            if (({}).hasOwnProperty.call(data.extensions, index)) {
                                var extension = data.extensions[index].toLowerCase();
                                $('#editSelectExt option[value="' + extension + '"]').prop('selected', true);
                            }
                        }
                        $('#editSelectExt').trigger('chosen:updated');
                        $('#formEditFolder').show();
                    }
                }
            });
        }
    }, {
        key: 'editFolder',
        value: function editFolder() {
            this._clearAlertResult('#alertEditResult');
            $('.form-group.has-danger').removeClass('has-danger');
            var idFolder = $('#inputEditFolder').val();
            var nameFolder = $('#editFolderName').val();
            var pathFolder = $('#editFolderPath').val();
            var extAllowed = $('#editSelectExt').val();
            var tabError = this._checkEditFolderForm();
            if (tabError.length > 0) {
                this._addError(tabError);
                return;
            }
            this._showLoader('edit');
            var that = this;
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
                success: function success(data) {
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
    }, {
        key: 'removeFolder',
        value: function removeFolder() {
            var _this2 = this;

            var idFolder = $('#inputRemoveFolder').val();
            var $tr = $('#tr' + idFolder);
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
                success: function success(data) {
                    _this2._hideLoader('remove');
                    if (data.result === 'success') {
                        $tr.remove();
                        $('#removeFolderModal').modal('hide');
                    } else {
                        $tr.show();
                        $('#alertErrorRemoveFolder').show();
                    }
                }
            });
        }
    }, {
        key: 'clearModalForm',
        value: function clearModalForm(type) {
            if (type === 'add') {
                $('#folderName, #folderPath, #selectExt').val('');
                $('#selectExt').trigger('chosen:updated');
            } else {
                $('#editFolderName, #editFolderPath, #editSelectExt').val('');
                $('#editSelectExt').trigger('chosen:updated');
            }
        }
    }, {
        key: 'onHiddenAddModal',
        value: function onHiddenAddModal() {
            this.clearModalForm('add');
            this._clearAlertResult('#alertResult');
            this._hideLoader('add');
            if (this.xhrAdd !== null) {
                this.xhrAdd.abort();
            }
        }
    }, {
        key: 'onHiddenEditModal',
        value: function onHiddenEditModal() {
            this.clearModalForm('edit');
            this._hideLoader('edit');
            this._clearAlertResult('#alertEditResult');
            $('#formEditFolder, #alertEditDisplay, #alertEditResult').hide();
            if (this.xhrEdit !== null) {
                this.xhrEdit.abort();
            }
        }

        // private

    }, {
        key: '_checkAddFolderForm',
        value: function _checkAddFolderForm() {
            var nameFolder = $('#folderName').val();
            var pathFolder = $('#folderPath').val();
            var allowedExt = $('#selectExt').val();
            var tabFormGroup = [];
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
    }, {
        key: '_checkEditFolderForm',
        value: function _checkEditFolderForm() {
            var nameFolder = $('#editFolderName').val();
            var pathFolder = $('#editFolderPath').val();
            var allowedExt = $('#editSelectExt').val();
            var tabFormGroup = [];
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
    }, {
        key: '_bindClickOnActionBtn',
        value: function _bindClickOnActionBtn() {
            var _this3 = this;

            $('.btnRemoveFolder').off('click').on('click', function (e) {
                _this3.displayRemoveModalFolder($(e.currentTarget));
            });
            $('.btnEditFolder').off('click').on('click', function (e) {
                _this3.displayEditModalFolder($(e.currentTarget));
            });
        }
    }, {
        key: '_addError',
        value: function _addError(tabError) {
            $(tabError).each(function (i) {
                $(tabError[i]).addClass('has-danger');
            });
        }
    }, {
        key: '_setResult',
        value: function _setResult(idAlert, type, message) {
            var $alert = $(idAlert);
            if ($alert.length === 0) {
                throw new Error('#alertResult don\'t exist');
            }
            var alertCssClass = type === 'error' ? 'alert-danger' : 'alert-success';
            $alert.addClass(alertCssClass);
            $alert.find('p').html(message);
            $alert.show();
        }
    }, {
        key: '_clearAlertResult',
        value: function _clearAlertResult(id) {
            var $alert = $(id);
            if ($alert.length === 0) {
                throw new Error('#alertResult don\'t exist');
            }
            $alert.removeClass('alert-danger').removeClass('alert-success');
            $alert.find('p').html('');
            $alert.hide();
        }
    }, {
        key: '_showLoader',
        value: function _showLoader(type) {
            if (type === 'add') {
                $('#loaderAddFolder').show();
                $('#btnAddFolder, #btnCloseAddModal').addClass('disabled');
            } else if (type === 'remove') {
                $('#loaderRemoveFolder').show();
                $('#btnRemoveFolder, #btnCloseRemoveModal').addClass('disabled');
            } else {
                $('#loaderEditFolder').show();
                $('#btnEditFolder, #btnCloseEditModal').addClass('disabled');
            }
        }
    }, {
        key: '_hideLoader',
        value: function _hideLoader(type) {
            if (type === 'add') {
                $('#loaderAddFolder').hide();
                $('#btnAddFolder, #btnCloseAddModal').removeClass('disabled');
            } else if (type === 'remove') {
                $('#loaderRemoveFolder').hide();
                $('#btnRemoveFolder, #btnCloseRemoveModal').removeClass('disabled');
            } else {
                $('#loaderEditFolder').hide();
                $('#btnEditFolder, #btnCloseEditModal').removeClass('disabled');
            }
        }
    }, {
        key: '_refreshFolderTable',
        value: function _refreshFolderTable() {
            var $tableBody = $('#tableFolder').find('tbody');
            if ($tableBody.length === 0) {
                return;
            }
            // Abort if a refresh request is in progress
            if (this.xhrRefresh !== null) {
                this.xhrRefresh.abort();
            }
            $tableBody.html(''); // reset table body
            var that = this;
            this.xhrRefresh = $.ajax({
                type: 'POST',
                url: window.location.href,
                data: {
                    type: 'getFolders'
                },
                success: function success(data) {
                    $tableBody.html(data);
                    that._bindClickOnActionBtn();
                }
            });
        }
    }]);

    return Folders;
})();

$(document).ready(function () {
    new Folders();
});
//# sourceMappingURL=folders.js.map
