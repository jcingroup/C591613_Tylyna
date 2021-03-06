"use strict";
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const update = require('react-addons-update');
const CommCmpt = require('comm-cmpt');
const CommFunc = require('comm-func');
require("react-datepicker/dist/react-datepicker.css");
var Community;
(function (Community) {
    class GridRow extends React.Component {
        constructor() {
            super();
            this.modify = this.modify.bind(this);
        }
        modify() {
            this.props.updateType(this.props.primKey);
        }
        render() {
            return React.createElement("tr", null, React.createElement("td", {className: "text-xs-center"}, React.createElement(CommCmpt.GridButtonDel, {removeItemSubmit: this.props.removeItemSubmit, primKey: this.props.primKey})), React.createElement("td", {className: "text-xs-center"}, React.createElement(CommCmpt.GridButtonModify, {modify: this.modify})), React.createElement("td", null, this.props.itemData.community_id), React.createElement("td", null, this.props.itemData.community_name));
        }
    }
    GridRow.defaultProps = {};
    class GirdForm extends React.Component {
        constructor() {
            super();
            this.updateType = this.updateType.bind(this);
            this.noneType = this.noneType.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.handleSearch = this.handleSearch.bind(this);
            this.removeItemSubmit = this.removeItemSubmit.bind(this);
            this.deleteSubmit = this.deleteSubmit.bind(this);
            this.delCheck = this.delCheck.bind(this);
            this.checkAll = this.checkAll.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.componentDidUpdate = this.componentDidUpdate.bind(this);
            this.componentWillUnmount = this.componentWillUnmount.bind(this);
            this.insertType = this.insertType.bind(this);
            this.state = {
                fieldData: null,
                gridData: { rows: [], page: 1 },
                edit_type: 0,
                searchData: { keyword: null },
                editPrimKey: null
            };
        }
        componentDidMount() {
            this.queryGridData(1);
        }
        componentDidUpdate(prevProps, prevState) {
            if ((prevState.edit_type == 0 && (this.state.edit_type == 1 || this.state.edit_type == 2))) {
                CKEDITOR.replace('txt_spot', { customConfig: '../ckeditor/inlineConfig.js' });
                CKEDITOR.replace('txt_public', { customConfig: '../ckeditor/inlineConfig.js' });
            }
        }
        componentWillUnmount() {
        }
        gridData(page) {
            var parms = {
                page: 0
            };
            if (page == 0) {
                parms.page = this.state.gridData.page;
            }
            else {
                parms.page = page;
            }
            $.extend(parms, this.state.searchData);
            return CommFunc.jqGet(this.props.apiPath, parms);
        }
        queryGridData(page) {
            this.gridData(page)
                .done((data, textStatus, jqXHRdata) => {
                if (data.records == 0) {
                    CommFunc.tosMessage(null, '無任何資料', 2);
                }
                this.setState({ gridData: data });
            })
                .fail((jqXHR, textStatus, errorThrown) => {
                CommFunc.showAjaxError(errorThrown);
            });
        }
        handleSubmit(e) {
            e.preventDefault();
            this.state.fieldData.txt_spot = CKEDITOR.instances['txt_spot'].getData();
            this.state.fieldData.txt_public = CKEDITOR.instances['txt_public'].getData();
            if (this.state.edit_type == 1) {
                CommFunc.jqPost(this.props.apiPath, this.state.fieldData)
                    .done((data, textStatus, jqXHRdata) => {
                    if (data.result) {
                        CommFunc.tosMessage(null, '新增完成', 1);
                        this.updateType(data.id);
                    }
                    else {
                        alert(data.message);
                    }
                })
                    .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
            }
            else if (this.state.edit_type == 2) {
                var packData = { id: this.state.editPrimKey, md: this.state.fieldData };
                CommFunc.jqPut(this.props.apiPath, packData)
                    .done((data, textStatus, jqXHRdata) => {
                    if (data.result) {
                        CommFunc.tosMessage(null, '修改完成', 1);
                    }
                    else {
                        alert(data.message);
                    }
                })
                    .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
            }
            ;
            return;
        }
        deleteSubmit() {
            if (!confirm('確定是否刪除?')) {
                return;
            }
            var ids = [];
            for (var i in this.state.gridData.rows) {
                if (this.state.gridData.rows[i].check_del) {
                    ids.push('ids=' + this.state.gridData.rows[i].community_id);
                }
            }
            if (ids.length == 0) {
                CommFunc.tosMessage(null, '未選擇刪除項', 2);
                return;
            }
            CommFunc.jqDelete(this.props.apiPath + '?' + ids.join('&'), {})
                .done(function (data, textStatus, jqXHRdata) {
                if (data.result) {
                    CommFunc.tosMessage(null, '刪除完成', 1);
                    this.queryGridData(0);
                }
                else {
                    alert(data.message);
                }
            }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
        }
        removeItemSubmit(primKey) {
            if (!confirm('確定是否刪除?')) {
                return;
            }
            CommFunc.jqDelete(this.props.apiPath, { id: primKey })
                .done(function (data, textStatus, jqXHRdata) {
                if (data.result) {
                    CommFunc.tosMessage(null, '刪除完成', 1);
                    this.queryGridData(0);
                }
                else {
                    alert(data.message);
                }
            }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
        }
        handleSearch(e) {
            e.preventDefault();
            this.queryGridData(0);
            return;
        }
        delCheck(i, chd) {
            let newState = this.state;
            this.state.gridData.rows[i].check_del = !chd;
            this.setState(newState);
        }
        checkAll() {
            let newState = this.state;
            newState.checkAll = !newState.checkAll;
            for (var prop in this.state.gridData.rows) {
                this.state.gridData.rows[prop].check_del = newState.checkAll;
            }
            this.setState(newState);
        }
        insertType() {
            this.setState({
                edit_type: 1, fieldData: {
                    group_buying_url: 'http://www.jojogo168.com/'
                }
            });
        }
        updateType(id) {
            var idPack = { id: id };
            CommFunc.jqGet(this.props.apiPath, idPack)
                .done((data, textStatus, jqXHRdata) => {
                this.setState({
                    edit_type: 2,
                    fieldData: data.data,
                    editPrimKey: id
                });
            })
                .fail((jqXHR, textStatus, errorThrown) => {
                CommFunc.showAjaxError(errorThrown);
            });
        }
        noneType() {
            this.gridData(0)
                .done((data, textStatus, jqXHRdata) => {
                this.setState({ edit_type: 0, gridData: data, editPrimKey: null });
            })
                .fail((jqXHR, textStatus, errorThrown) => {
                CommFunc.showAjaxError(errorThrown);
            });
        }
        changeFDValue(name, e) {
            this.setInputValue(this.props.fdName, name, e);
        }
        changeGDValue(name, e) {
            this.setInputValue(this.props.gdName, name, e);
        }
        setInputValue(collentName, name, e) {
            let input = e.target;
            let value;
            if (input.value == 'true') {
                value = true;
            }
            else if (input.value == 'false') {
                value = false;
            }
            else {
                value = input.value;
            }
            var objForUpdate = {
                [collentName]: {
                    [name]: { $set: value }
                }
            };
            var newState = update(this.state, objForUpdate);
            this.setState(newState);
        }
        render() {
            var outHtml = null;
            var GridNavPage = CommCmpt.GridNavPage;
            if (this.state.edit_type == 0) {
                var search = this.state.searchData;
                outHtml =
                    (React.createElement("div", null, React.createElement("ul", {className: "breadcrumb"}, React.createElement("li", null, React.createElement("i", {className: "fa-caret-right"}), " ", this.props.menuName), React.createElement("li", null, React.createElement("i", {className: "fa-angle-right"}), " ", this.props.caption)), React.createElement("h3", {className: "h3"}, this.props.caption), React.createElement("form", {onSubmit: this.handleSearch}, React.createElement("div", {className: "table-responsive"}, React.createElement("div", {className: "table-header"}, React.createElement("div", {className: "table-filter"}, React.createElement("div", {className: "form-inline"}, React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "sr-only"}, "搜尋商家名稱"), " ", React.createElement("input", {type: "text", className: "form-control form-control-sm", onChange: this.changeGDValue.bind(this, 'keyword'), value: this.state.searchData.keyword, placeholder: "商家名稱"}), " ", React.createElement("button", {className: "btn btn-sm btn-primary", type: "submit"}, React.createElement("i", {className: "fa-search"}), " 搜尋"))))), React.createElement("table", {className: "table table-sm table-bordered table-striped"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {style: { "width": "7%" }, className: "text-xs-center"}, "刪除"), React.createElement("th", {style: { "width": "7%" }, className: "text-xs-center"}, "修改"), React.createElement("th", {style: { "width": "26%" }}, "編號"), React.createElement("th", {style: { "width": "60%" }}, "商家名稱"))), React.createElement("tbody", null, this.state.gridData.rows.map((itemData, i) => React.createElement(GridRow, {key: i, primKey: itemData.community_id, itemData: itemData, removeItemSubmit: this.removeItemSubmit, updateType: this.updateType}))))), React.createElement(GridNavPage, {startCount: this.state.gridData.startcount, endCount: this.state.gridData.endcount, recordCount: this.state.gridData.records, totalPage: this.state.gridData.total, nowPage: this.state.gridData.page, queryGridData: this.queryGridData, insertType: this.insertType, deleteSubmit: this.deleteSubmit, showDelete: false}))));
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                let field = this.state.fieldData;
                let up_CommunityList = null;
                let up_CommunityDoor = null;
                let up_CommunityPublic = null;
                if (this.state.edit_type == 2) {
                    up_CommunityList = React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "商家代表圖"), React.createElement("div", {className: "col-xs-7"}, React.createElement(CommCmpt.MasterImageUpload, {FileKind: "CommunityList", MainId: field.community_id, ParentEditType: this.state.edit_type, url_upload: gb_approot + 'Active/Matter/axFUpload', url_list: gb_approot + 'Active/Matter/axFList', url_delete: gb_approot + 'Active/Matter/axFDelete', url_sort: gb_approot + 'Active/Matter/axFSort'}), React.createElement("small", {className: "text-muted"}, "最多可上傳 1 張圖片")));
                    up_CommunityDoor = React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "商家相簿"), React.createElement("div", {className: "col-xs-7"}, React.createElement(CommCmpt.MasterImageUpload, {FileKind: "CommunityDoor", MainId: field.community_id, ParentEditType: this.state.edit_type, url_upload: gb_approot + 'Active/Matter/axFUpload', url_list: gb_approot + 'Active/Matter/axFList', url_delete: gb_approot + 'Active/Matter/axFDelete', url_sort: gb_approot + 'Active/Matter/axFSort'}), React.createElement("small", {className: "text-muted"}, "最多可上傳 10 張圖片")));
                    up_CommunityPublic = React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "社區公設"), React.createElement("div", {className: "col-xs-7"}, React.createElement(CommCmpt.MasterImageUpload, {FileKind: "CommunityPublic", MainId: field.community_id, ParentEditType: this.state.edit_type, url_upload: gb_approot + 'Active/Matter/axFUpload', url_list: gb_approot + 'Active/Matter/axFList', url_delete: gb_approot + 'Active/Matter/axFDelete', url_sort: gb_approot + 'Active/Matter/axFSort'}), React.createElement("small", {className: "text-muted"}, "最多可上傳 10 張圖片")));
                }
                var outHtml = (React.createElement("div", null, React.createElement("ul", {className: "breadcrumb"}, React.createElement("li", null, React.createElement("i", {className: "fa-caret-right"}), " ", this.props.menuName), React.createElement("li", null, React.createElement("i", {className: "fa-angle-right"}), " ", this.props.caption), React.createElement("li", null, React.createElement("i", {className: "fa-angle-right"}), " ", "資料維護")), React.createElement("h3", {className: "h3"}, " ", this.props.caption, " ", React.createElement("small", {className: "sub"}, React.createElement("i", {className: "fa-angle-double-right"}), " 資料維護")), React.createElement("form", {className: "form form-sm", onSubmit: this.handleSubmit}, React.createElement("h4", {className: "h4"}, "商家基本資料"), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, React.createElement("small", {className: "text-danger"}, "*"), "  商家名稱"), React.createElement("div", {className: "col-xs-7"}, React.createElement("input", {type: "text", className: "form-control", onChange: this.changeFDValue.bind(this, 'community_name'), value: field.community_name, maxLength: 64, required: true}))), up_CommunityList, React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "簡介"), React.createElement("div", {className: "col-xs-7"}, React.createElement("textarea", {type: "text", className: "form-control", onChange: this.changeFDValue.bind(this, 'info_content'), rows: 5, value: field.info_content, maxLength: 4000}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "地圖嵌入"), React.createElement("div", {className: "col-xs-7"}, React.createElement("input", {type: "text", className: "form-control", onChange: this.changeFDValue.bind(this, 'map_iframe'), value: field.map_iframe, maxLength: 4000}), React.createElement("small", {className: "text-muted"}, "請使用 Google 地圖 的 內嵌地圖功能，操作方式請看 教學影片1"))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "商家特色"), React.createElement("div", {className: "col-xs-7"}, React.createElement("textarea", {className: "form-control", id: "txt_spot", name: "txt_spot", value: field.txt_spot, onChange: this.changeFDValue.bind(this, 'txt_spot')}))), React.createElement("hr", {className: "sm"}), React.createElement("h4", {className: "h4"}, "商家聯絡資訊"), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, React.createElement("small", {className: "text-danger"}, "*"), " 登錄帳號"), React.createElement("div", {className: "col-xs-3"}, React.createElement("input", {type: "text", className: "form-control", onChange: this.changeFDValue.bind(this, 'account'), value: field.account, maxLength: 64, required: true})), React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, React.createElement("small", {className: "text-danger"}, "*"), " 登錄密碼"), React.createElement("div", {className: "col-xs-3"}, React.createElement("input", {type: "password", className: "form-control", onChange: this.changeFDValue.bind(this, 'passwd'), value: field.passwd, maxLength: 64, required: true}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "聯絡人"), React.createElement("div", {className: "col-xs-7"}, React.createElement("input", {type: "text", className: "form-control", onChange: this.changeFDValue.bind(this, 'contact'), value: field.contact}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "電話"), React.createElement("div", {className: "col-xs-7"}, React.createElement("input", {type: "tel", className: "form-control", onChange: this.changeFDValue.bind(this, 'tel'), value: field.tel}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "E-mail"), React.createElement("div", {className: "col-xs-7"}, React.createElement("input", {type: "email", className: "form-control", onChange: this.changeFDValue.bind(this, 'email'), value: field.email}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "團購連結"), React.createElement("div", {className: "col-xs-7"}, React.createElement("input", {type: "text", className: "form-control", onChange: this.changeFDValue.bind(this, 'group_buying_url'), value: field.group_buying_url}), React.createElement("small", {className: "text-muted"}, "請輸入完整網址 (包含 http://) "))), React.createElement("hr", {className: "sm"}), React.createElement("h4", {className: "h4"}, "商家實景"), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "內容介紹"), React.createElement("div", {className: "col-xs-7"}, React.createElement("textarea", {className: "form-control", id: "txt_public", name: "txt_public", value: field.txt_public, onChange: this.changeFDValue.bind(this, 'txt_public')}))), up_CommunityDoor, React.createElement("div", {className: "form-action"}, React.createElement("div", {className: "col-xs-offset-1"}, React.createElement("button", {type: "submit", className: "btn btn-sm btn-primary"}, React.createElement("i", {className: "fa-check"}), " 儲存"), " ", React.createElement("button", {type: "button", onClick: this.noneType, className: "btn btn-sm btn-secondary"}, React.createElement("i", {className: "fa-times"}), " 回前頁"))))));
            }
            return outHtml;
        }
    }
    GirdForm.defaultProps = {
        fdName: 'fieldData',
        gdName: 'searchData',
        apiPath: gb_approot + 'api/Community'
    };
    Community.GirdForm = GirdForm;
})(Community || (Community = {}));
var dom = document.getElementById('page_content');
ReactDOM.render(React.createElement(Community.GirdForm, {caption: gb_caption, menuName: gb_menuname, iconClass: "fa-list-alt"}), dom);
