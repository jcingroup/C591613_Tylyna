"use strict";
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('react-dom');
const CommCmpt = require('comm-cmpt');
const CommFunc = require('comm-func');
const components_1 = require('../components');
const def_data_1 = require('../ts-comm/def-data');
var MenuSet;
(function (MenuSet) {
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
            let StateForGird = CommCmpt.StateForGird;
            return React.createElement("tr", null, React.createElement("td", {className: "text-xs-center"}, React.createElement(CommCmpt.GridCheckDel, {iKey: this.props.ikey, chd: this.props.itemData.check_del, delCheck: this.delCheck})), React.createElement("td", {className: "text-xs-center"}, React.createElement(CommCmpt.GridButtonModify, {modify: this.modify})), React.createElement("td", null, this.props.itemData.menu_id), React.createElement("td", null, this.props.itemData.parent_menu_id), React.createElement("td", null, this.props.itemData.menu_name), React.createElement("td", null, this.props.itemData.area), React.createElement("td", null, this.props.itemData.controller), React.createElement("td", null, this.props.itemData.action), React.createElement("td", null, this.props.itemData.icon_class), React.createElement("td", null, this.props.itemData.sort), React.createElement("td", null, this.props.itemData.is_folder ? React.createElement("span", {className: "label label-success"}, "父選單") : React.createElement("span", {className: "label label-primary"}, "子選單")));
        }
    }
    GridRow.defaultProps = {
        fdName: 'fieldData',
        gdName: 'searchData',
        apiPathName: gb_approot + 'api/Menu'
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
            this.handleSearch = this.handleSearch.bind(this);
            this.getAjaxInitData = this.getAjaxInitData.bind(this);
            this.setRolesCheck = this.setRolesCheck.bind(this);
            this.render = this.render.bind(this);
            this.state = {
                fieldData: {},
                gridData: { rows: [], page: 1 },
                edit_type: 0,
                searchData: { keyword: null, is_folder: null },
                folder: []
            };
        }
        componentDidMount() {
            this.queryGridData(1);
            this.getAjaxInitData();
        }
        getAjaxInitData() {
            CommFunc.jqGet(this.props.apiInitPath, {})
                .done(function (data, textStatus, jqXHRdata) {
                console.log(data);
                this.setState({ folder: data.options_folder });
            }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
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
                    ids.push('ids=' + this.state.gridData.rows[i].menu_id);
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
            CommFunc.jqGet(gb_approot + 'api/GetAction/GetInsertRoles', {})
                .done((data, textStatus, jqXHRdata) => {
                this.setState({ edit_type: 1, fieldData: { role_array: data, parent_menu_id: 0, sort: 0 } });
            })
                .fail((jqXHR, textStatus, errorThrown) => {
                CommFunc.showAjaxError(errorThrown);
            });
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
        chgFDVal(name, value, e) {
            let obj = this.state[this.props.fdName];
            obj[name] = value;
            this.setState({ fieldData: obj });
        }
        changeGDValue(name, e) {
            this.setInputValue(this.props.gdName, name, e);
        }
        setInputValue(collentName, name, e) {
            let input = e.target;
            let obj = this.state[collentName];
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
        setRolesCheck(i, e) {
            var obj = this.state[this.props.fdName];
            var roleObj = obj['role_array'];
            var item = roleObj[i];
            item.role_use = !item.role_use;
            this.setState({ fieldData: obj });
        }
        render() {
            var outHtml = null;
            if (this.state.edit_type == 0) {
                let searchData = this.state.searchData;
                let GridNavPage = CommCmpt.GridNavPage;
                outHtml =
                    (React.createElement("div", null, React.createElement("h3", {className: "h3"}, this.props.caption), React.createElement("form", {onSubmit: this.handleSearch}, React.createElement("div", {className: "table-responsive"}, React.createElement("div", {className: "table-header"}, React.createElement("div", {className: "table-filter"}, React.createElement("div", {className: "form-inline"}, React.createElement("div", {className: "form-group"}, React.createElement("label", {className: "sr-only"}, "選單名稱"), " ", React.createElement("input", {type: "text", className: "form-control form-control-sm", onChange: this.changeGDValue.bind(this, 'keyword'), value: searchData.keyword, placeholder: "選單名稱"}), " ", React.createElement("label", {className: "sr-only"}, "型態"), " ", React.createElement("select", {className: "form-control form-control-sm", onChange: this.changeGDValue.bind(this, 'is_folder'), value: searchData.is_folder}, React.createElement("option", {value: ""}, "全部型態"), React.createElement("option", {value: "true"}, "父選單"), React.createElement("option", {value: "false"}, "子選單")), " ", React.createElement("button", {className: "btn btn-sm btn-primary", type: "submit"}, React.createElement("i", {className: "fa-search"}), " 搜尋"))))), React.createElement("table", {className: "table table-sm table-bordered table-striped"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {style: { "width": "6%" }, className: "text-xs-center"}, React.createElement("label", {className: "c-input c-checkbox"}, React.createElement("input", {type: "checkbox", checked: this.state.checkAll, onChange: this.checkAll}), React.createElement("span", {className: "c-indicator"}), "全選")), React.createElement("th", {style: { "width": "6%" }, className: "text-xs-center"}, "修改"), React.createElement("th", {style: { "width": "6%" }}, "編號"), React.createElement("th", {style: { "width": "14%" }}, "對應父選單"), React.createElement("th", {style: { "width": "14%" }}, "選單名稱"), React.createElement("th", {style: { "width": "10%" }}, "area"), React.createElement("th", {style: { "width": "10%" }}, "controller"), React.createElement("th", {style: { "width": "10%" }}, "action"), React.createElement("th", {style: { "width": "10%" }}, "icon_class"), React.createElement("th", {style: { "width": "6%" }}, "排序"), React.createElement("th", {style: { "width": "8%" }}, "選單狀態"))), React.createElement("tbody", null, this.state.gridData.rows.map((itemData, i) => React.createElement(GridRow, {key: i, ikey: i, primKey: itemData.menu_id, itemData: itemData, delCheck: this.delCheck, updateType: this.updateType}))))), React.createElement(GridNavPage, {startCount: this.state.gridData.startcount, endCount: this.state.gridData.endcount, recordCount: this.state.gridData.records, totalPage: this.state.gridData.total, nowPage: this.state.gridData.page, queryGridData: this.queryGridData, insertType: this.insertType, deleteSubmit: this.deleteSubmit}))));
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                let fieldData = this.state.fieldData;
                let InputDate = CommCmpt.InputDate;
                outHtml = (React.createElement("div", null, React.createElement("h3", {className: "h3"}, " ", this.props.caption, " ", React.createElement("small", {className: "sub"}, React.createElement("i", {className: "fa-angle-double-right"}), " 資料維護")), React.createElement("form", {className: "form form-sm", onSubmit: this.handleSubmit}, React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-2 form-control-label text-xs-right"}, "編號"), React.createElement("div", {className: "col-xs-4"}, React.createElement("input", {type: "number", className: "form-control", value: fieldData.menu_id, onChange: this.changeFDValue.bind(this, 'menu_id'), placeholder: "系統自動產生", disabled: true}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-2 form-control-label text-xs-right"}, React.createElement("small", {className: "text-danger"}, "*"), " 父選單"), React.createElement("div", {className: "col-xs-4"}, React.createElement("select", {className: "form-control", value: fieldData.parent_menu_id, onChange: this.changeFDValue.bind(this, 'parent_menu_id')}, React.createElement("option", {value: "0"}, "無"), this.state.folder.map(function (itemData, i) {
                    return React.createElement("option", {key: i, value: itemData.val}, itemData.Lname);
                })))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-2 form-control-label text-xs-right"}, React.createElement("small", {className: "text-danger"}, "*"), " 選單名稱"), React.createElement("div", {className: "col-xs-4"}, React.createElement("input", {type: "text", className: "form-control", value: fieldData.menu_name, onChange: this.changeFDValue.bind(this, 'menu_name'), maxLength: 128, required: true}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-2 form-control-label text-xs-right"}, "area"), React.createElement("div", {className: "col-xs-4"}, React.createElement("input", {type: "text", className: "form-control", value: fieldData.area, onChange: this.changeFDValue.bind(this, 'area'), maxLength: 64}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-2 form-control-label text-xs-right"}, "controller"), React.createElement("div", {className: "col-xs-4"}, React.createElement("input", {type: "text", className: "form-control", value: fieldData.controller, onChange: this.changeFDValue.bind(this, 'controller'), maxLength: 16}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-2 form-control-label text-xs-right"}, "action"), React.createElement("div", {className: "col-xs-4"}, React.createElement("input", {type: "text", className: "form-control", value: fieldData.action, onChange: this.changeFDValue.bind(this, 'action'), maxLength: 16}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-2 form-control-label text-xs-right"}, "icon_class"), React.createElement("div", {className: "col-xs-4"}, React.createElement("input", {type: "text", className: "form-control", value: fieldData.icon_class, onChange: this.changeFDValue.bind(this, 'icon_class'), maxLength: 128}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-2 form-control-label text-xs-right"}, "排序"), React.createElement("div", {className: "col-xs-4"}, React.createElement("input", {type: "number", className: "form-control", onChange: this.changeFDValue.bind(this, 'sort'), value: fieldData.sort, required: true}), React.createElement("small", {className: "text-muted"}, "由小到大排序"))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-2 form-control-label text-xs-right"}, "選單狀態"), React.createElement("div", {className: "col-xs-4"}, React.createElement(components_1.RadioBox, {wrapperClassName: "radio-group-stacked", inputViewMode: 1, name: "is_folder", id: "is_folder", value: fieldData.is_folder, onChange: this.chgFDVal.bind(this, 'is_folder'), required: true, labelClassName: "c-input c-radio", spanClassName: "c-indicator", textClassName: "text-sm", radioList: def_data_1.IMenuParentsData}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-2 form-control-label text-xs-right"}, "使用狀態"), React.createElement("div", {className: "col-xs-4"}, React.createElement(components_1.RadioBox, {wrapperClassName: "radio-group-stacked", inputViewMode: 1, name: "is_use", id: "is_use", value: fieldData.is_use, onChange: this.chgFDVal.bind(this, 'is_use'), required: true, labelClassName: "c-input c-radio", spanClassName: "c-indicator", textClassName: "text-sm", radioList: def_data_1.IUsedData}))), React.createElement("div", {className: "form-group row"}, React.createElement("label", {className: "col-xs-2 form-control-label text-xs-right"}, "可檢視角色"), React.createElement("div", {className: "col-xs-10"}, fieldData.role_array.map((itemData, i) => React.createElement("div", {className: "checkbox", key: itemData.role_id}, React.createElement("label", null, React.createElement("input", {type: "checkbox", checked: itemData.role_use, onChange: this.setRolesCheck.bind(this, i)}), itemData.role_name))))), React.createElement("div", {className: "form-action"}, React.createElement("div", {className: "col-xs-offset-2"}, React.createElement("button", {type: "submit", className: "btn btn-sm btn-primary"}, React.createElement("i", {className: "fa-check"}), " 儲存"), " ", React.createElement("button", {type: "button", onClick: this.noneType, className: "btn btn-sm btn-secondary"}, React.createElement("i", {className: "fa-times"}), " 回前頁"))))));
            }
            return outHtml;
        }
    }
    GridForm.defaultProps = {
        fdName: 'fieldData',
        gdName: 'searchData',
        apiPath: gb_approot + 'api/Menu',
        apiInitPath: gb_approot + 'Base/Menu/aj_Init'
    };
    MenuSet.GridForm = GridForm;
})(MenuSet || (MenuSet = {}));
var dom = document.getElementById('page_content');
ReactDOM.render(React.createElement(MenuSet.GridForm, {caption: gb_caption, menuName: gb_menuname, iconClass: "fa-list-alt"}), dom);
