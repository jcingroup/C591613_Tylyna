"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDOM = require('react-dom');
var CommFunc = require('comm-func');
var ReactBootstrap = require("react-bootstrap");
var Menu;
(function (Menu) {
    var MenuDef = (function () {
        function MenuDef() {
        }
        return MenuDef;
    }());
    var MenuTree = (function (_super) {
        __extends(MenuTree, _super);
        function MenuTree() {
            _super.call(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.componentWillMount = this.componentWillMount.bind(this);
            this.makeTreeData = this.makeTreeData.bind(this);
            this.onClick = this.onClick.bind(this);
            this.state = {
                menu_data: []
            };
        }
        MenuTree.prototype.componentWillMount = function () {
        };
        MenuTree.prototype.componentDidMount = function () {
            var _this = this;
            CommFunc.jqGet(gb_approot + 'api/GetAction/GetMenuQuery', {})
                .done(function (data, textStatus, jqXHRdata) {
                var c_data = CommFunc.clone(data);
                var fst = new MenuDef();
                fst.Key = 0;
                fst.ParentKey = 0;
                fst.Title = 'root';
                fst.sub = _this.makeTreeData(fst, c_data);
                _this.setState({ menu_data: fst.sub });
            })
                .fail(function (jqXHR, textStatus, errorThrown) {
                CommFunc.showAjaxError(errorThrown);
            });
        };
        MenuTree.prototype.makeTreeData = function (item, data) {
            var collect_Sub = [];
            for (var i in data) {
                var m = data[i];
                if (m.ParentKey == item.Key) {
                    m.parent = item;
                    if (m.Area == this.props.area) {
                        if (m.Controller == this.props.controller) {
                            if (m.Action == '') {
                                if (this.props.action == this.props.def_action) {
                                    m.Checked = true;
                                    m.parent.Checked = true;
                                }
                            }
                            else {
                                if (this.props.action == m.Action) {
                                    m.Checked = true;
                                    m.parent.Checked = true;
                                }
                            }
                        }
                    }
                    collect_Sub.push(m);
                    m.sub = this.makeTreeData(m, data);
                }
            }
            return collect_Sub;
        };
        MenuTree.prototype.onClick = function (menu_id) {
            var obj = this.state.menu_data;
            for (var i in obj) {
                if (obj[i].Key == menu_id) {
                    obj[i].Checked = true;
                }
                else {
                    obj[i].Checked = false;
                }
            }
            this.setState({ menu_data: obj });
        };
        MenuTree.prototype.render = function () {
            var _this = this;
            var Collapse = ReactBootstrap.Collapse;
            return (React.createElement("div", null, React.createElement("h3", {className: "h3"}, React.createElement("i", {className: "fa-bars"}), " 功能選單 MENU"), React.createElement("div", {id: "menu"}, React.createElement("div", {className: "panel"}, this.state.menu_data.map(function (menu, i) {
                var out_html = null;
                var ele_class = null;
                if (menu.Checked) {
                    out_html =
                        React.createElement("div", {className: "panel-active", key: menu.Key}, React.createElement("div", {className: "panel-heading"}, React.createElement("a", {href: "#", onClick: _this.onClick.bind(_this, menu.Key), className: "panel-title"}, React.createElement("i", {className: menu.IconClass}), " ", menu.Title)), React.createElement(Collapse, {in: menu.Checked}, React.createElement("div", {className: "panel-collapse"}, React.createElement("ul", {className: "panel-body list-unstyled"}, menu.sub.map(function (menu_item, j) {
                            var out_html_sub_item = null;
                            var active_link = null;
                            var link_str = null;
                            if (menu_item.Action == '') {
                                link_str = gb_approot + menu_item.Area + '/' + menu_item.Controller;
                            }
                            else {
                                link_str = gb_approot + menu_item.Area + '/' + menu_item.Controller + '/' + menu_item.Action;
                            }
                            if (menu_item.Checked) {
                                active_link =
                                    React.createElement("a", {href: link_str, className: "active", title: menu_item.Title}, React.createElement("i", {className: "fa-caret-right"}), menu_item.Title);
                            }
                            else {
                                active_link =
                                    React.createElement("a", {href: link_str, title: menu_item.Title}, React.createElement("i", {className: "fa-caret-right"}), menu_item.Title);
                            }
                            out_html_sub_item =
                                React.createElement("li", {key: menu_item.Key}, active_link);
                            return out_html_sub_item;
                        })))));
                }
                else {
                    out_html =
                        React.createElement("div", {key: menu.Key}, React.createElement("div", {className: "panel-heading"}, React.createElement("a", {href: "#", onClick: _this.onClick.bind(_this, menu.Key), className: "panel-title collapsed"}, React.createElement("i", {className: menu.IconClass}), " ", menu.Title)), React.createElement(Collapse, {in: menu.Checked}, React.createElement("div", {className: "panel-collapse"}, React.createElement("ul", {className: "panel-body list-unstyled"}, menu.sub.map(function (menu_item, j) {
                            var out_html_sub_item = null;
                            var active_link = null;
                            var link_str = null;
                            if (menu_item.Action == '') {
                                link_str = gb_approot + menu_item.Area + '/' + menu_item.Controller;
                            }
                            else {
                                link_str = gb_approot + menu_item.Area + '/' + menu_item.Controller + '/' + menu_item.Action;
                            }
                            if (menu_item.Checked) {
                                active_link = React.createElement("a", {href: link_str, className: "active", title: menu_item.Title}, React.createElement("i", {className: "fa-caret-right"}), menu_item.Title);
                            }
                            else {
                                active_link = React.createElement("a", {href: link_str, title: menu_item.Title}, React.createElement("i", {className: "fa-caret-right"}), menu_item.Title);
                            }
                            out_html_sub_item =
                                React.createElement("li", {key: menu_item.Key}, active_link);
                            return out_html_sub_item;
                        })))));
                }
                return out_html;
            })))));
        };
        MenuTree.defaultProps = {};
        return MenuTree;
    }(React.Component));
    Menu.MenuTree = MenuTree;
})(Menu || (Menu = {}));
var dom = document.getElementById('sidebar');
ReactDOM.render(React.createElement(Menu.MenuTree, {area: gb_area, controller: gb_controller, action: gb_action, def_action: gb_def_action}), dom);
