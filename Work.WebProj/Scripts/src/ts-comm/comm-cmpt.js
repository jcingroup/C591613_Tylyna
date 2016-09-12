"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var comm_func_1 = require('comm-func');
var ReactBootstrap = require('react-bootstrap');
var Sortable = require('sortablejs');
var upload = require("simple-ajax-uploader");
var DT = require("dt");
var GridButtonModify = (function (_super) {
    __extends(GridButtonModify, _super);
    function GridButtonModify(props) {
        _super.call(this, props);
        this.onClick = this.onClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = {
            className: 'fa-pencil'
        };
    }
    GridButtonModify.prototype.componentDidMount = function () {
        if (this.props.ver == 2) {
            this.setState({ className: 'fa-search-plus' });
        }
    };
    GridButtonModify.prototype.onClick = function () {
        this.props.modify();
    };
    GridButtonModify.prototype.render = function () {
        return React.createElement("button", {type: "button", className: "btn-link btn-lg", onClick: this.onClick}, React.createElement("i", {className: this.state.className}));
    };
    GridButtonModify.defaultProps = {
        ver: 1
    };
    return GridButtonModify;
}(React.Component));
exports.GridButtonModify = GridButtonModify;
var GridCheckDel = (function (_super) {
    __extends(GridCheckDel, _super);
    function GridCheckDel() {
        _super.call(this);
        this.onChange = this.onChange.bind(this);
    }
    GridCheckDel.prototype.onChange = function (e) {
        this.props.delCheck(this.props.iKey, this.props.chd);
    };
    GridCheckDel.prototype.render = function () {
        return React.createElement("label", {className: "c-input c-checkbox"}, React.createElement("input", {type: "checkbox", checked: this.props.chd, onChange: this.onChange}), React.createElement("span", {className: "c-indicator"}));
    };
    return GridCheckDel;
}(React.Component));
exports.GridCheckDel = GridCheckDel;
var GridButtonDel = (function (_super) {
    __extends(GridButtonDel, _super);
    function GridButtonDel() {
        _super.call(this);
        this.onClick = this.onClick.bind(this);
    }
    GridButtonDel.prototype.onClick = function (e) {
        this.props.removeItemSubmit(this.props.primKey);
    };
    GridButtonDel.prototype.render = function () {
        return React.createElement("button", {type: "button", onClick: this.onClick, className: "btn-link btn-lg text-danger"}, React.createElement("i", {className: "fa-times"}));
    };
    return GridButtonDel;
}(React.Component));
exports.GridButtonDel = GridButtonDel;
var GridNavPage = (function (_super) {
    __extends(GridNavPage, _super);
    function GridNavPage(props) {
        _super.call(this, props);
        this.nextPage = this.nextPage.bind(this);
        this.prvePage = this.prvePage.bind(this);
        this.firstPage = this.firstPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
    }
    GridNavPage.prototype.firstPage = function () {
        this.props.queryGridData(1);
    };
    GridNavPage.prototype.lastPage = function () {
        this.props.queryGridData(this.props.totalPage);
    };
    GridNavPage.prototype.nextPage = function () {
        if (this.props.nowPage < this.props.totalPage) {
            this.props.queryGridData(this.props.nowPage + 1);
        }
    };
    GridNavPage.prototype.prvePage = function () {
        if (this.props.nowPage > 1) {
            this.props.queryGridData(this.props.nowPage - 1);
        }
    };
    GridNavPage.prototype.jumpPage = function () {
    };
    GridNavPage.prototype.render = function () {
        var setAddButton = null, setDeleteButton = null;
        if (this.props.showAdd) {
            setAddButton = React.createElement("button", {className: "btn btn-sm btn-success", type: "button", onClick: this.props.insertType}, React.createElement("i", {className: "fa-plus-circle"}), " 新增");
        }
        if (this.props.showDelete) {
            setDeleteButton = React.createElement("button", {className: "btn btn-sm btn-danger", type: "button", onClick: this.props.deleteSubmit}, React.createElement("i", {className: "fa-trash-o"}), " 刪除");
        }
        var oper = null;
        oper = (React.createElement("div", {className: "table-footer clearfix"}, React.createElement("div", {className: "pull-xs-left"}, setAddButton, " ", setDeleteButton), React.createElement("small", {className: "pull-xs-right"}, "第", this.props.startCount, "-", this.props.endCount, "筆，共", this.props.recordCount, "筆"), React.createElement("ul", {className: "pager pager-sm"}, React.createElement("li", null, React.createElement("a", {href: "#", title: "移至第一頁", tabIndex: -1, onClick: this.firstPage}, React.createElement("i", {className: "fa-angle-double-left"}))), " ", React.createElement("li", null, React.createElement("a", {href: "#", title: "上一頁", tabIndex: -1, onClick: this.prvePage}, React.createElement("i", {className: "fa-angle-left"}))), " ", React.createElement("li", {className: "form-inline"}, React.createElement("div", {className: "form-group"}, React.createElement("label", null, "第"), ' ', React.createElement("input", {style: { "width": "100px" }, className: "form-control form-control-sm text-xs-center", type: "number", min: "1", tabIndex: -1, value: this.props.nowPage.toString(), onChange: this.jumpPage}), ' ', React.createElement("label", null, "頁，共", this.props.totalPage, "頁"))), " ", React.createElement("li", null, React.createElement("a", {href: "#", title: "@Resources.Res.NextPage", tabIndex: -1, onClick: this.nextPage}, React.createElement("i", {className: "fa-angle-right"}))), " ", React.createElement("li", null, React.createElement("a", {href: "#", title: "移至最後一頁", tabIndex: -1, onClick: this.lastPage}, React.createElement("i", {className: "fa-angle-double-right"}))))));
        return oper;
    };
    GridNavPage.defaultProps = {
        showAdd: true,
        showDelete: true
    };
    return GridNavPage;
}(React.Component));
exports.GridNavPage = GridNavPage;
var Tips = (function (_super) {
    __extends(Tips, _super);
    function Tips() {
        _super.apply(this, arguments);
    }
    Tips.prototype.render = function () {
        var Tooltip = ReactBootstrap.Tooltip;
        var OverlayTrigger = ReactBootstrap.OverlayTrigger;
        var tooltipObj = (React.createElement(Tooltip, {id: "abc"}, this.props.comment));
        var out_html = null;
        out_html = (React.createElement(OverlayTrigger, {placement: "top", overlay: tooltipObj}, React.createElement("i", {className: "fa-question-circle text-info"})));
        return out_html;
    };
    return Tips;
}(React.Component));
exports.Tips = Tips;
var MasterImageUpload = (function (_super) {
    __extends(MasterImageUpload, _super);
    function MasterImageUpload() {
        _super.call(this);
        this.createFileUpLoadObject = this.createFileUpLoadObject.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.getFileList = this.getFileList.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.sortableGroupDecorator = this.sortableGroupDecorator.bind(this);
        this.render = this.render.bind(this);
        this.state = {
            filelist: []
        };
        this._sortable = null;
        this._upload = null;
        if (Array.prototype.movesort === undefined) {
            Array.prototype.movesort = function (old_index, new_index) {
                if (new_index >= this.length) {
                    var k = new_index - this.length;
                    while ((k--) + 1) {
                        this.push(undefined);
                    }
                }
                this.splice(new_index, 0, this.splice(old_index, 1)[0]);
                return this;
            };
        }
    }
    MasterImageUpload.prototype.componentDidMount = function () {
        if (this.props.ParentEditType == 2) {
            if (typeof this.props.MainId === 'string') {
                if (this.props.MainId != null) {
                    this.createFileUpLoadObject();
                    this.getFileList();
                }
            }
            else if (typeof this.props.MainId === 'number') {
                if (this.props.MainId > 0) {
                    this.createFileUpLoadObject();
                    this.getFileList();
                }
            }
        }
    };
    MasterImageUpload.prototype.componentDidUpdate = function (prevProps, prevState) {
        console.log(this.props.MainId, prevProps.MainId);
        if (this.props.ParentEditType == 2) {
            if (typeof this.props.MainId === 'string') {
                if (this.props.MainId != null && prevProps.MainId == null) {
                    this.createFileUpLoadObject();
                    this.getFileList();
                }
            }
            else if (typeof this.props.MainId === 'number') {
                if (this.props.MainId > 0 && prevProps.MainId == 0) {
                    this.createFileUpLoadObject();
                    this.getFileList();
                }
            }
        }
    };
    MasterImageUpload.prototype.componentWillUnmount = function () {
        if (this.props.ParentEditType == 2) {
            this._sortable.destroy();
            this._upload.destroy();
        }
    };
    MasterImageUpload.prototype.deleteFile = function (guid) {
        comm_func_1.jqPost(this.props.url_delete, {
            id: this.props.MainId,
            fileKind: this.props.FileKind,
            guid: guid
        })
            .done(function (data, textStatus, jqXHRdata) {
            if (data.result) {
                this.getFileList();
            }
            else {
                alert(data.message);
            }
        }.bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
            comm_func_1.showAjaxError(errorThrown);
        });
    };
    MasterImageUpload.prototype.createFileUpLoadObject = function () {
        if (this.props.ParentEditType == 1)
            return;
        var btn = document.getElementById('upload-btn-' + this.props.MainId + '-' + this.props.FileKind);
        var _this = this;
        this._upload = new upload.SimpleUpload({
            button: btn,
            url: this.props.url_upload,
            data: {
                id: this.props.MainId,
                fileKind: this.props.FileKind
            },
            name: 'fileName',
            multiple: true,
            maxSize: 5000,
            allowedExtensions: ['jpg', 'jpeg', 'png'],
            accept: 'image/*',
            responseType: 'json',
            encodeCustomHeaders: true,
            onSubmit: function (filename, ext) {
                if (_this.props.MainId == 0) {
                    alert('此筆資料未完成新增，無法上傳檔案!');
                    return false;
                }
                var progress = document.createElement('div'), bar = document.createElement('div'), fileSize = document.createElement('div'), wrapper = document.createElement('div'), progressBox = document.getElementById('progressBox-' + _this.props.MainId + '-' + _this.props.FileKind);
                progress.className = 'progress';
                bar.className = 'progress-bar progress-bar-success progress-bar-striped active';
                fileSize.className = 'size';
                wrapper.className = 'wrapper';
                progress.appendChild(bar);
                wrapper.innerHTML = '<div class="name">' + filename + '</div>';
                wrapper.appendChild(fileSize);
                wrapper.appendChild(progress);
                progressBox.appendChild(wrapper);
                this.setProgressBar(bar);
                this.setFileSizeBox(fileSize);
                this.setProgressContainer(wrapper);
            },
            onSizeError: function () {
            },
            onExtError: function () {
            },
            onComplete: function (file, response) {
                if (response.result) {
                    _this.getFileList();
                }
                else {
                    alert(response.message);
                }
            }
        });
    };
    MasterImageUpload.prototype.getFileList = function () {
        comm_func_1.jqPost(this.props.url_list, {
            id: this.props.MainId,
            fileKind: this.props.FileKind
        })
            .done(function (data, textStatus, jqXHRdata) {
            if (data.result) {
                this.setState({ filelist: data.files });
            }
            else {
                alert(data.message);
            }
        }.bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
            comm_func_1.showAjaxError(errorThrown);
        });
    };
    MasterImageUpload.prototype.sortableGroupDecorator = function (componentBackingInstance) {
        if (componentBackingInstance) {
            var _this_1 = this;
            var options = {
                draggable: "li",
                group: "shared",
                onSort: function (evt) {
                    var data_array = _this_1.state.filelist;
                    data_array.movesort(evt.oldIndex, evt.newIndex);
                    var parms = [];
                    for (var i in data_array) {
                        var item = data_array[i];
                        parms.push(item.guid);
                    }
                    comm_func_1.jqPost(_this_1.props.url_sort, {
                        id: _this_1.props.MainId,
                        fileKind: _this_1.props.FileKind,
                        guids: parms
                    })
                        .done(function (data, textStatus, jqXHRdata) {
                        if (data.result) {
                            _this_1.setState({ filelist: [] });
                            _this_1.setState({ filelist: data_array });
                        }
                        else {
                            alert(data.message);
                        }
                    })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                        comm_func_1.showAjaxError(errorThrown);
                    });
                },
                onEnd: function (evt) {
                    console.log('onEnd');
                },
                onUpdate: function (evt) {
                    var itemEl = evt.item;
                    console.log('onUpdate');
                },
            };
            this._sortable = Sortable.create(componentBackingInstance, options);
        }
    };
    ;
    MasterImageUpload.prototype.render = function () {
        var outHtml = null;
        var img_button_html = null;
        if (this.props.ParentEditType == 1) {
            img_button_html = React.createElement("small", {className: "text-danger"}, "請先存檔，再上傳檔案");
        }
        else {
            img_button_html =
                React.createElement("div", {className: "form-control"}, React.createElement("input", {type: "file", id: 'upload-btn-' + this.props.MainId + '-' + this.props.FileKind, accept: "image/*"}));
        }
        outHtml = (React.createElement("div", null, img_button_html, React.createElement("ol", {className: "upload-img list-inline", ref: this.sortableGroupDecorator}, this.state.filelist.map(function (itemData, i) {
            var subOutHtml = React.createElement("li", {key: itemData.guid}, React.createElement("button", {type: "button", className: "close", onClick: this.deleteFile.bind(this, itemData.guid), title: "刪除圖片"}, " × "), React.createElement("img", {src: itemData.iconPath, title: comm_func_1.formatFileSize(itemData.size)}));
            return subOutHtml;
        }.bind(this))), React.createElement("div", {id: 'progressBox-' + this.props.MainId + '-' + this.props.FileKind, className: "progress-wrap"})));
        return outHtml;
    };
    MasterImageUpload.defaultProps = {
        MainId: 0,
        FileKind: 'F'
    };
    return MasterImageUpload;
}(React.Component));
exports.MasterImageUpload = MasterImageUpload;
var MasterFileUpload = (function (_super) {
    __extends(MasterFileUpload, _super);
    function MasterFileUpload() {
        _super.call(this);
        this.createFileUpLoadObject = this.createFileUpLoadObject.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.getFileList = this.getFileList.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.render = this.render.bind(this);
        this.state = {
            filelist: [],
            download_src: ''
        };
    }
    MasterFileUpload.prototype.componentDidMount = function () {
        if (typeof this.props.MainId === 'string') {
            if (this.props.MainId != null) {
                this.createFileUpLoadObject();
                this.getFileList();
            }
        }
        else if (typeof this.props.MainId === 'number') {
            if (this.props.MainId > 0) {
                this.createFileUpLoadObject();
                this.getFileList();
            }
        }
    };
    MasterFileUpload.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (typeof this.props.MainId === 'string') {
            if (this.props.MainId != null && prevProps.MainId == null) {
                this.createFileUpLoadObject();
                this.getFileList();
            }
        }
        else if (typeof this.props.MainId === 'number') {
            if (this.props.MainId > 0 && prevProps.MainId == 0) {
                this.createFileUpLoadObject();
                this.getFileList();
            }
        }
    };
    MasterFileUpload.prototype.deleteFile = function (filename) {
        comm_func_1.jqPost(this.props.url_delete, {
            id: this.props.MainId,
            fileKind: this.props.FileKind,
            filename: filename
        })
            .done(function (data, textStatus, jqXHRdata) {
            if (data.result) {
                this.getFileList();
            }
            else {
                alert(data.message);
            }
        }.bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
            comm_func_1.showAjaxError(errorThrown);
        });
    };
    MasterFileUpload.prototype.downloadFile = function (id, filekind, filename) {
        var parms = [];
        parms.push('id=' + id);
        parms.push('filekind=' + filekind);
        parms.push('filename=' + filename);
        parms.push('tid=' + comm_func_1.uniqid());
        var src = this.props.url_download + '?' + parms.join('&');
        this.setState({ download_src: src });
    };
    MasterFileUpload.prototype.createFileUpLoadObject = function () {
        if (this.props.ParentEditType == 1)
            return;
        var btn = document.getElementById('upload-btn-' + this.props.MainId + '-' + this.props.FileKind);
        var _this = this;
        var uploader = new upload.SimpleUpload({
            button: btn,
            url: this.props.url_upload,
            data: {
                id: this.props.MainId,
                fileKind: this.props.FileKind
            },
            name: 'fileName',
            multiple: true,
            maxSize: 5000,
            allowedExtensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'png', 'jpg', 'jpeg'],
            accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,image/*',
            responseType: 'json',
            encodeCustomHeaders: true,
            onSubmit: function (filename, ext) {
                if (_this.props.MainId == 0) {
                    alert('此筆資料未完成新增，無法上傳檔案!');
                    return false;
                }
                var progress = document.createElement('div'), bar = document.createElement('div'), fileSize = document.createElement('div'), wrapper = document.createElement('div'), progressBox = document.getElementById('progressBox-' + _this.props.MainId);
                progress.className = 'progress';
                bar.className = 'progress-bar progress-bar-success progress-bar-striped active';
                fileSize.className = 'size';
                wrapper.className = 'wrapper';
                progress.appendChild(bar);
                wrapper.innerHTML = '<div class="name">' + filename + '</div>';
                wrapper.appendChild(fileSize);
                wrapper.appendChild(progress);
                progressBox.appendChild(wrapper);
                this.setProgressBar(bar);
                this.setFileSizeBox(fileSize);
                this.setProgressContainer(wrapper);
            },
            onSizeError: function () {
            },
            onExtError: function () {
            },
            onComplete: function (file, response) {
                if (response.result) {
                    _this.getFileList();
                }
                else {
                    alert(response.message);
                }
            }
        });
    };
    MasterFileUpload.prototype.getFileList = function () {
        comm_func_1.jqPost(this.props.url_list, {
            id: this.props.MainId,
            fileKind: this.props.FileKind
        })
            .done(function (data, textStatus, jqXHRdata) {
            if (data.result) {
                this.setState({ filelist: data.files });
            }
            else {
                alert(data.message);
            }
        }.bind(this))
            .fail(function (jqXHR, textStatus, errorThrown) {
            comm_func_1.showAjaxError(errorThrown);
        });
    };
    MasterFileUpload.prototype.render = function () {
        var outHtml = null;
        var fileButtonHtml = null;
        if (this.props.ParentEditType == 1) {
            fileButtonHtml = (React.createElement("div", {className: "form-control"}, React.createElement("small", {className: "col-xs-6 help-inline"}, "請先按儲存後方可上傳檔案")));
        }
        else if (this.props.ParentEditType == 2) {
            fileButtonHtml = (React.createElement("div", {className: "form-control"}, React.createElement("input", {type: "file", id: 'upload-btn-' + this.props.MainId + '-' + this.props.FileKind})));
        }
        ;
        outHtml = (React.createElement("div", null, fileButtonHtml, React.createElement("p", {className: "help-block", ref: "SortImage"}, this.state.filelist.map(function (itemData, i) {
            var subOutHtml = React.createElement("span", {className: "doc-upload", key: i}, React.createElement("i", {className: "fa-file-text-o"}), React.createElement("button", {type: "button", className: "close", onClick: this.deleteFile.bind(this, itemData.fileName), title: "刪除檔案"}, " × "), React.createElement("button", {type: "button", className: "btn-link", onClick: this.downloadFile.bind(this, this.props.MainId, this.props.FileKind, itemData.fileName)}, itemData.fileName));
            return subOutHtml;
        }, this)), React.createElement("div", {id: 'progressBox-' + this.props.MainId, className: "progress-wrap"}), React.createElement("iframe", {src: this.state.download_src, style: { visibility: 'hidden', display: 'none' }})));
        return outHtml;
    };
    MasterFileUpload.defaultProps = {
        MainId: 0,
        FileKind: 'F'
    };
    return MasterFileUpload;
}(React.Component));
exports.MasterFileUpload = MasterFileUpload;
var TwAddress = (function (_super) {
    __extends(TwAddress, _super);
    function TwAddress(props) {
        _super.call(this, props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.onZipChange = this.onZipChange.bind(this);
        this.onCityChange = this.onCityChange.bind(this);
        this.onCountryChange = this.onCountryChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.listCountry = this.listCountry.bind(this);
        this.render = this.render.bind(this);
        this.state = {
            country_list: []
        };
    }
    TwAddress.prototype.componentDidMount = function () {
        if (this.props.city_value != null) {
            this.listCountry(this.props.city_value);
        }
    };
    TwAddress.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (this.props.city_value != null && this.props.city_value != prevProps.city_value) {
            this.listCountry(this.props.city_value);
        }
    };
    TwAddress.prototype.onZipChange = function (e) {
        var input = e.target;
        var data = {
            identity: this.props.identity,
            zip_value: input.value,
            city_value: this.props.city_value,
            country_value: this.props.country_value,
            address_value: this.props.address_value,
            index: this.props.index,
            type: 1
        };
        this.props.onChange(data, e);
    };
    TwAddress.prototype.onCityChange = function (e) {
        var input = e.target;
        var data = {
            identity: this.props.identity,
            zip_value: this.props.zip_value,
            city_value: input.value,
            country_value: this.props.country_value,
            address_value: this.props.address_value,
            index: this.props.index,
            type: 2
        };
        this.listCountry(input.value);
        this.props.onChange(data, e);
    };
    TwAddress.prototype.onCountryChange = function (e) {
        var input = e.target;
        var zip_value = null;
        for (var i in this.state.country_list) {
            var item = this.state.country_list[i];
            if (item.county == input.value) {
                zip_value = item.zip;
                break;
            }
        }
        var data = {
            identity: this.props.identity,
            zip_value: zip_value,
            city_value: this.props.city_value,
            country_value: input.value,
            address_value: this.props.address_value,
            index: this.props.index,
            type: 3
        };
        this.props.onChange(data, e);
    };
    TwAddress.prototype.onAddressChange = function (e) {
        var input = e.target;
        var data = {
            identity: this.props.identity,
            zip_value: this.props.zip_value,
            city_value: this.props.city_value,
            country_value: this.props.country_value,
            address_value: input.value,
            index: this.props.index,
            type: 4
        };
        this.props.onChange(data, e);
    };
    TwAddress.prototype.listCountry = function (value) {
        if (value == null || value == undefined || value == '') {
            this.setState({ country_list: [] });
        }
        else {
            for (var i in DT.twDistrict) {
                var item = DT.twDistrict[i];
                if (item.city == value) {
                    this.setState({ country_list: item.contain });
                    break;
                }
            }
        }
    };
    TwAddress.prototype.render = function () {
        var out_html = null;
        if (this.props.ver == 1) {
            out_html = (React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-xs-2"}, React.createElement("input", {type: "text", className: "form-control", value: this.props.zip_value, onChange: this.onZipChange, maxLength: 5, required: true, disabled: true})), React.createElement("div", {className: "col-xs-2"}, React.createElement("select", {className: "form-control", value: this.props.city_value, onChange: this.onCityChange, required: this.props.required, disabled: this.props.disabled}, React.createElement("option", {value: ""}), DT.twDistrict.map(function (itemData, i) {
                return React.createElement("option", {key: itemData.city, value: itemData.city}, itemData.city);
            }))), React.createElement("div", {className: "col-xs-2"}, React.createElement("select", {className: "form-control", value: this.props.country_value, onChange: this.onCountryChange, required: this.props.required, disabled: this.props.disabled}, React.createElement("option", {value: ""}), this.state.country_list.map(function (itemData, i) {
                return React.createElement("option", {key: itemData.county, value: itemData.county}, itemData.county);
            }))), React.createElement("div", {className: "col-xs-6"}, React.createElement("input", {type: "text", className: "form-control", value: this.props.address_value, onChange: this.onAddressChange, maxLength: 128, required: this.props.required, disabled: this.props.disabled}))));
        }
        return out_html;
    };
    TwAddress.defaultProps = {
        onChange: null,
        zip_value: null,
        city_value: null,
        country_value: null,
        address_value: null,
        required: false,
        disabled: false,
        ver: 1
    };
    return TwAddress;
}(React.Component));
exports.TwAddress = TwAddress;
var StateForGird = (function (_super) {
    __extends(StateForGird, _super);
    function StateForGird() {
        _super.call(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.render = this.render.bind(this);
        this.state = {
            setClass: null,
            label: null
        };
    }
    StateForGird.prototype.componentWillReceiveProps = function (nextProps) {
        for (var i in this.props.stateData) {
            var item = this.props.stateData[i];
            if (item.id == nextProps.id) {
                this.setState({ setClass: item.classNameforG, label: item.label });
                break;
            }
        }
    };
    StateForGird.prototype.componentDidMount = function () {
        for (var i in this.props.stateData) {
            var item = this.props.stateData[i];
            if (item.id == this.props.id) {
                this.setState({ setClass: item.classNameforG, label: item.label });
                break;
            }
        }
    };
    StateForGird.prototype.render = function () {
        var outHtml = null;
        outHtml = React.createElement("span", {className: this.state.setClass}, this.state.label);
        return outHtml;
    };
    StateForGird.defaultProps = {
        stateData: [],
        id: null,
        ver: 1
    };
    return StateForGird;
}(React.Component));
exports.StateForGird = StateForGird;
