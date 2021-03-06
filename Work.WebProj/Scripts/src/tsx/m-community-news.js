"use strict";
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const update = require('react-addons-update');
const Moment = require('moment');
const CommCmpt = require('comm-cmpt');
const CommFunc = require('comm-func');
const dt = require('dt');
const DatePicker = require('react-datepicker');
require("react-datepicker/dist/react-datepicker.css");
var News;
(function (News) {
    class GridRow extends React.Component {
        constructor() {
            super();
            this.modify = this.modify.bind(this);
        }
        modify() {
            this.props.updateType(this.props.primKey);
        }
        render() {
            let state = [];
            state['A'] = React.createElement("span", {className: "label label-success"}, "顯示");
            state['C'] = React.createElement("span", {className: "label label-danger"}, "關閉");
            return React.createElement("tr", null, React.createElement("td", {className: "text-xs-center"}, React.createElement(CommCmpt.GridButtonDel, {removeItemSubmit: this.props.removeItemSubmit, primKey: this.props.primKey})), React.createElement("td", {className: "text-xs-center"}, React.createElement(CommCmpt.GridButtonModify, {modify: this.modify})), React.createElement("td", null, this.props.itemData.community_name), React.createElement("td", null, this.props.itemData.title), React.createElement("td", null, Moment(this.props.itemData.start_date).format(dt.dateFT)), React.createElement("td", null, Moment(this.props.itemData.end_date).format(dt.dateFT)), React.createElement("td", null, state[this.props.itemData.state]));
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
            CommFunc.jqGet(gb_approot + 'Api/GetAction/GetOptionsCommunity', {})
                .done((data) => {
                this.setState({ options_community: data });
            });
            this.queryGridData(1);
        }
        componentDidUpdate(prevProps, prevState) {
            if ((prevState.edit_type == 0 && (this.state.edit_type == 1 || this.state.edit_type == 2))) {
                CKEDITOR.replace('news_content', { customConfig: '../ckeditor/inlineConfig.js' });
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
            this.state.fieldData.context = CKEDITOR.instances['news_content'].getData();
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
                    ids.push('ids=' + this.state.gridData.rows[i].community_news_id);
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
                edit_type: 1,
                fieldData: {
                    start_date: Moment().format(dt.dateFT),
                    state: 'A',
                    community_id: community_id
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
            this.setEventValue(this.props.fdName, name, e);
        }
        changeGDValue(name, e) {
            this.setEventValue(this.props.gdName, name, e);
        }
        setEventValue(collentName, name, e) {
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
        setInputValue(collentName, name, v) {
            var objForUpdate = {
                [collentName]: {
                    [name]: { $set: v }
                }
            };
            var newState = update(this.state, objForUpdate);
            this.setState(newState);
        }
        setInputValueMuti(collentName, name, v) {
            var objForUpdate = { [collentName]: {} };
            for (var i in name) {
                var item = name[i];
                var value = v[i];
                objForUpdate[collentName][item] = { $set: value };
            }
            var newState = update(this.state, objForUpdate);
            this.setState(newState);
        }
        setChangeDate(collentName, name, date) {
            var v = date == null ? null : date.format();
            var objForUpdate = {
                [collentName]: {
                    [name]: {
                        $set: v
                    }
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
                    (React.createElement("div", null, React.createElement("ul", {className: "breadcrumb"}, React.createElement("li", null, React.createElement("i", {className: "fa-caret-right"}), " ", this.props.menuName), React.createElement("li", null, React.createElement("i", {className: "fa-angle-right"}), " ", this.props.caption)), React.createElement("h3", {className: "h3"}, this.props.caption), React.createElement("form", {onSubmit: this.handleSearch}, React.createElement("div", {className: "table-responsive"}, React.createElement("div", {className: "table-header"}, React.createElement("div", {className: "table-filter"}, React.createElement("div", {className: "form-inline"}, React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "sr-only"}, "搜尋商家名稱"), " ", React.createElement("input", {type: "text", className: "form-control form-control-sm", onChange: this.changeGDValue.bind(this, 'keyword'), value: this.state.searchData.keyword, placeholder: "商家名稱"}), " ", React.createElement("button", {className: "btn btn-sm btn-primary", type: "submit"}, React.createElement("i", {className: "fa-search"}), " 搜尋"))))), React.createElement("table", {className: "table table-sm table-bordered table-striped"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {style: { "width": "7%" }, className: "text-xs-center"}, "刪除"), React.createElement("th", {style: { "width": "7%" }, className: "text-xs-center"}, "修改"), React.createElement("th", {style: { "width": "20%" }}, "商家名稱"), React.createElement("th", {style: { "width": "30%" }}, "標題"), React.createElement("th", {style: { "width": "13%" }}, "啟始日期"), React.createElement("th", {style: { "width": "13%" }}, "結束日期"), React.createElement("th", {style: { "width": "10%" }}, "狀態"))), React.createElement("tbody", null, this.state.gridData.rows.map((itemData, i) => React.createElement(GridRow, {key: i, primKey: itemData.community_news_id, itemData: itemData, removeItemSubmit: this.removeItemSubmit, updateType: this.updateType}))))), React.createElement(GridNavPage, {startCount: this.state.gridData.startcount, endCount: this.state.gridData.endcount, recordCount: this.state.gridData.records, totalPage: this.state.gridData.total, nowPage: this.state.gridData.page, queryGridData: this.queryGridData, insertType: this.insertType, deleteSubmit: this.deleteSubmit, showDelete: false}))));
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                let field = this.state.fieldData;
                let mnt_start_date = CommFunc.MntV(field.start_date);
                let mnt_end_date = CommFunc.MntV(field.end_date);
                let end_date_disabled = mnt_start_date == null ? true : false;
                let fldState = {
                    label: field.state == 'A' ?
                        React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "狀態") :
                        React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "狀態"),
                    tip: field.state == 'A' ?
                        React.createElement("span", {className: "col-xs-1"}) :
                        React.createElement("span", {className: "col-xs-1"}, React.createElement(CommCmpt.Tips, {comment: "關閉說明：即使日期目前仍在有效範圍也不會顯示！"}))
                };
                var outHtml = (React.createElement("div", null, React.createElement("ul", {className: "breadcrumb"}, React.createElement("li", null, React.createElement("i", {className: "fa-caret-right"}), " ", this.props.menuName), React.createElement("li", null, React.createElement("i", {className: "fa-angle-right"}), " ", this.props.caption), React.createElement("li", null, React.createElement("i", {className: "fa-angle-right"}), " ", "資料維護")), React.createElement("h3", {className: "h3"}, " ", this.props.caption, " ", React.createElement("small", {className: "sub"}, React.createElement("i", {className: "fa-angle-double-right"}), " 資料維護")), React.createElement("form", {className: "form form-sm", onSubmit: this.handleSubmit}, React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, React.createElement("small", {className: "text-danger"}, "*"), " 標題"), React.createElement("div", {className: "col-xs-8"}, React.createElement("input", {type: "text", className: "form-control", onChange: this.changeFDValue.bind(this, 'title'), value: field.title, maxLength: 128, required: true}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, React.createElement("small", {className: "text-danger"}, "*"), " 所屬商家"), React.createElement("div", {className: "col-xs-8"}, React.createElement("select", {className: "form-control", required: true, value: field.community_id, onChange: this.changeFDValue.bind(this, 'community_id'), disabled: community_id != null}, React.createElement("option", {value: "", selected: true, disabled: true}, "請選擇"), this.state.options_community.map(function (item, i) {
                    return (React.createElement("option", {value: item.community_id, key: item.community_id}, item.community_name));
                })))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, React.createElement("small", {className: "text-danger"}, "*"), " 刊登時間"), React.createElement("div", {className: "col-xs-4"}, React.createElement("div", {className: "input-group input-group-sm"}, React.createElement("span", {className: "input-group-addon"}, "起"), React.createElement(DatePicker, {selected: mnt_start_date, dateFormat: dt.dateFT, isClearable: true, required: true, locale: "zh-TW", showYearDropdown: true, minDate: Moment(), onChange: this.setChangeDate.bind(this, this.props.fdName, 'start_date'), className: "form-control"}))), React.createElement("div", {className: "col-xs-4"}, React.createElement("div", {className: "input-group input-group-sm"}, React.createElement("span", {className: "input-group-addon"}, "迄"), React.createElement(DatePicker, {selected: mnt_end_date, dateFormat: dt.dateFT, isClearable: true, required: true, locale: "zh-TW", showYearDropdown: true, onChange: this.setChangeDate.bind(this, this.props.fdName, 'end_date'), className: "form-control", minDate: mnt_start_date, disabled: end_date_disabled})))), React.createElement("div", {className: "form-group row"}, fldState.label, React.createElement("div", {className: "col-xs-4"}, React.createElement("select", {className: "form-control", required: true, value: field.state, onChange: this.changeFDValue.bind(this, 'state')}, React.createElement("option", {value: "A"}, "顯示"), React.createElement("option", {value: "C"}, "關閉"))), fldState.tip), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "內容"), React.createElement("div", {className: "col-xs-8"}, React.createElement("textarea", {type: "date", className: "form-control", id: "news_content", name: "news_content", value: field.context, onChange: this.changeFDValue.bind(this, 'context')}))), React.createElement("div", {className: "form-action"}, React.createElement("div", {className: "col-xs-offset-1"}, React.createElement("button", {type: "submit", className: "btn btn-sm btn-primary"}, React.createElement("i", {className: "fa-check"}), " 儲存"), " ", React.createElement("button", {type: "button", className: "btn btn-sm btn-secondary", onClick: this.noneType}, React.createElement("i", {className: "fa-times"}), " 回前頁"))))));
            }
            return outHtml;
        }
    }
    GirdForm.defaultProps = {
        fdName: 'fieldData',
        gdName: 'searchData',
        apiPath: gb_approot + 'api/CommunityNews'
    };
    News.GirdForm = GirdForm;
})(News || (News = {}));
var dom = document.getElementById('page_content');
ReactDOM.render(React.createElement(News.GirdForm, {caption: gb_caption, menuName: gb_menuname, iconClass: "fa-list-alt"}), dom);
