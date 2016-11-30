"use strict";
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const CommCmpt = require('comm-cmpt');
const CommFunc = require('comm-func');
var Users;
(function (Users) {
    class GridRow extends React.Component {
        constructor() {
            super();
            this.delCheck = this.delCheck.bind(this);
            this.modify = this.modify.bind(this);
        }
        delCheck(i, chd) {
            this.props.delCheck(i, chd);
        }
        modify() {
            this.props.updateType(this.props.primKey);
        }
        render() {
            return React.createElement("tr", null, React.createElement("td", {className: "text-xs-center"}, React.createElement(CommCmpt.GridCheckDel, {iKey: this.props.ikey, chd: this.props.itemData.check_del, delCheck: this.delCheck})), React.createElement("td", {className: "text-xs-center"}, React.createElement(CommCmpt.GridButtonModify, {modify: this.modify})), React.createElement("td", null, this.props.itemData.UserName), React.createElement("td", null, this.props.itemData.user_name_c), React.createElement("td", null, this.props.itemData.Email));
        }
    }
    GridRow.defaultProps = {
        fdName: 'fieldData',
        gdName: 'searchData',
        apiPathName: gb_approot + 'api/Users'
    };
    class GridForm extends React.Component {
        constructor() {
            super();
            this.updateType = this.updateType.bind(this);
            this.noneType = this.noneType.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.deleteSubmit = this.deleteSubmit.bind(this);
            this.delCheck = this.delCheck.bind(this);
            this.checkAll = this.checkAll.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.insertType = this.insertType.bind(this);
            this.changeGDValue = this.changeGDValue.bind(this);
            this.changeFDValue = this.changeFDValue.bind(this);
            this.setInputValue = this.setInputValue.bind(this);
            this.render = this.render.bind(this);
            this.setRolesCheck = this.setRolesCheck.bind(this);
            this.state = {
                fieldData: { role_array: [] },
                gridData: { rows: [], page: 1 },
                edit_type: 0
            };
        }
        componentDidMount() {
            this.queryGridData(1);
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
                this.setState({ gridData: data });
            })
                .fail((jqXHR, textStatus, errorThrown) => {
                CommFunc.showAjaxError(errorThrown);
            });
        }
        handleSubmit(e) {
            e.preventDefault();
            if (this.state.edit_type == 1) {
                CommFunc.jqPost(this.props.apiPath, this.state.fieldData)
                    .done((data, textStatus, jqXHRdata) => {
                    if (data.result) {
                        CommFunc.tosMessage(null, '新增完成', 1);
                        this.updateType(data.ID);
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
                CommFunc.jqPut(this.props.apiPath, this.state.fieldData)
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
        handleOnBlur(date) {
        }
        deleteSubmit() {
            if (!confirm('確定是否刪除?')) {
                return;
            }
            var ids = [];
            for (var i in this.state.gridData.rows) {
                if (this.state.gridData.rows[i].check_del) {
                    ids.push('ids=' + this.state.gridData.rows[i].Id);
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
            this.setState({ edit_type: 1, fieldData: { role_array: [] } });
        }
        updateType(id) {
            CommFunc.jqGet(this.props.apiPath, { id: id })
                .done((data, textStatus, jqXHRdata) => {
                this.setState({ edit_type: 2, fieldData: data.data });
            })
                .fail((jqXHR, textStatus, errorThrown) => {
                CommFunc.showAjaxError(errorThrown);
            });
        }
        noneType() {
            this.gridData(0)
                .done(function (data, textStatus, jqXHRdata) {
                this.setState({ edit_type: 0, gridData: data });
            }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
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
            let obj = this.state[collentName];
            console.log(name);
            if (input.value == 'true') {
                obj[name] = true;
            }
            else if (input.value == 'false') {
                obj[name] = false;
            }
            else {
                obj[name] = input.value;
            }
            this.setState({ fieldData: obj });
        }
        setRolesCheck(index, e) {
            var obj = this.state[this.props.fdName];
            var roleObj = obj['role_array'];
            var item = roleObj[index];
            item.role_use = !item.role_use;
            this.setState({ fieldData: obj });
        }
        render() {
            var outHtml = null;
            if (this.state.edit_type == 0) {
                let searchData = this.state.searchData;
                let GridNavPage = CommCmpt.GridNavPage;
                outHtml =
                    (React.createElement("div", null, React.createElement("ul", {className: "breadcrumb"}, React.createElement("li", null, React.createElement("i", {className: "fa-caret-right"}), " ", this.props.menuName), React.createElement("li", null, React.createElement("i", {className: "fa-angle-right"}), " ", this.props.caption)), React.createElement("h3", {className: "h3"}, this.props.caption), React.createElement("form", {onSubmit: this.handleSearch}, React.createElement("div", {className: "table-responsive"}, React.createElement("div", {className: "table-header"}, React.createElement("div", {className: "table-filter"}, React.createElement("div", {className: "form-inline"}, React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "sr-only"}, "使用者名稱"), " ", React.createElement("input", {type: "text", className: "form-control form-control-sm", onChange: this.changeGDValue.bind(this, 'UserName'), placeholder: "使用者名稱"}), " ", React.createElement("button", {className: "btn btn-sm btn-primary", type: "submit"}, React.createElement("i", {className: "fa-search"}), " 搜尋"))))), React.createElement("table", {className: "table table-sm table-bordered table-striped"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {style: { "width": "7%" }, className: "text-xs-center"}, React.createElement("label", {className: "c-input c-checkbox"}, React.createElement("input", {type: "checkbox", checked: this.state.checkAll, onChange: this.checkAll}), React.createElement("span", {className: "c-indicator"}), "全選")), React.createElement("th", {style: { "width": "7%" }, className: "text-xs-center"}, "修改"), React.createElement("th", {style: { "width": "15%" }}, "UserName"), React.createElement("th", {style: { "width": "15%" }}, "簡稱"), React.createElement("th", {style: { "width": "56%" }}, "Email"))), React.createElement("tbody", null, this.state.gridData.rows.map((itemData, i) => React.createElement(GridRow, {key: i, ikey: i, primKey: itemData.Id, itemData: itemData, delCheck: this.delCheck, updateType: this.updateType}))))), React.createElement(GridNavPage, {startCount: this.state.gridData.startcount, endCount: this.state.gridData.endcount, recordCount: this.state.gridData.records, totalPage: this.state.gridData.total, nowPage: this.state.gridData.page, queryGridData: this.queryGridData, insertType: this.insertType, deleteSubmit: this.deleteSubmit}))));
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                let fieldData = this.state.fieldData;
                console.log('role_array', fieldData.role_array);
                outHtml = (React.createElement("div", null, React.createElement("ul", {className: "breadcrumb"}, React.createElement("li", null, React.createElement("i", {className: "fa-caret-right"}), " ", this.props.menuName), React.createElement("li", null, React.createElement("i", {className: "fa-angle-right"}), " ", this.props.caption), React.createElement("li", null, React.createElement("i", {className: "fa-angle-right"}), " ", "資料維護")), React.createElement("h3", {className: "h3"}, " ", this.props.caption, " ", React.createElement("small", {className: "sub"}, React.createElement("i", {className: "fa-angle-double-right"}), " 資料維護")), React.createElement("form", {className: "form form-sm", onSubmit: this.handleSubmit}, React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, React.createElement("small", {className: "text-danger"}, "*"), " 登錄帳號"), React.createElement("div", {className: "col-xs-7"}, React.createElement("input", {type: "text", className: "form-control", onChange: this.changeFDValue.bind(this, 'UserName'), value: fieldData.UserName, maxLength: 16, disabled: this.state.edit_type == 2, required: true}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, React.createElement("small", {className: "text-danger"}, "*"), " 中文名稱"), React.createElement("div", {className: "col-xs-7"}, React.createElement("input", {type: "text", className: "form-control", onChange: this.changeFDValue.bind(this, 'user_name_c'), value: fieldData.user_name_c, maxLength: 32, required: true}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-1 form-control-label text-xs-right"}, "角色"), React.createElement("div", {className: "col-xs-7"}, fieldData.role_array.map((item, i) => {
                    var out_check = React.createElement("div", {className: "checkbox", key: item.role_id}, React.createElement("label", null, React.createElement("input", {type: "checkbox", checked: item.role_use, onChange: this.setRolesCheck.bind(this, i)}), item.role_name));
                    return out_check;
                }))), React.createElement("div", {className: "form-action"}, React.createElement("div", {className: "col-xs-offset-1"}, React.createElement("button", {type: "submit", className: "btn btn-sm btn-primary"}, React.createElement("i", {className: "fa-check"}), " 儲存"), " ", React.createElement("button", {type: "button", onClick: this.noneType, className: "btn btn-sm btn-secondary"}, React.createElement("i", {className: "fa-times"}), " 回前頁"))))));
            }
            return outHtml;
        }
    }
    GridForm.defaultProps = {
        fdName: 'fieldData',
        gdName: 'searchData',
        apiPath: gb_approot + 'api/Users'
    };
    Users.GridForm = GridForm;
})(Users || (Users = {}));
var dom = document.getElementById('page_content');
ReactDOM.render(React.createElement(Users.GridForm, {caption: gb_caption, menuName: gb_menuname, iconClass: "fa-list-alt"}), dom);
