"use strict";
const React = require('react');
const ReactDOM = require('react-dom');
const CommFunc = require('comm-func');
const ReactBootstrap = require("react-bootstrap");
var Menu;
(function (Menu) {
    class MenuDef {
    }
    class MenuTree extends React.Component {
        constructor() {
            super();
            this.componentDidMount = this.componentDidMount.bind(this);
            this.componentWillMount = this.componentWillMount.bind(this);
            this.makeTreeData = this.makeTreeData.bind(this);
            this.onClick = this.onClick.bind(this);
            this.state = {
                menu_data: []
            };
        }
        componentWillMount() {
        }
        componentDidMount() {
            CommFunc.jqGet(gb_approot + 'api/GetAction/GetMenuQuery', {})
                .done((data, textStatus, jqXHRdata) => {
                let c_data = CommFunc.clone(data);
                let fst = new MenuDef();
                fst.Key = 0;
                fst.ParentKey = 0;
                fst.Title = 'root';
                fst.sub = this.makeTreeData(fst, c_data);
                this.setState({ menu_data: fst.sub });
            })
                .fail((jqXHR, textStatus, errorThrown) => {
                CommFunc.showAjaxError(errorThrown);
            });
        }
        makeTreeData(item, data) {
            let collect_Sub = [];
            for (let i in data) {
                let m = data[i];
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
        }
        onClick(menu_id) {
            let obj = this.state.menu_data;
            for (let i in obj) {
                if (obj[i].Key == menu_id) {
                    obj[i].Checked = true;
                }
                else {
                    obj[i].Checked = false;
                }
            }
            this.setState({ menu_data: obj });
        }
        render() {
            let Collapse = ReactBootstrap.Collapse;
            return (React.createElement("div", null, React.createElement("h3", {className: "h3"}, React.createElement("i", {className: "fa-bars"}), " 功能選單 MENU"), React.createElement("div", {id: "menu"}, React.createElement("div", {className: "panel"}, this.state.menu_data.map((menu, i) => {
                let out_html = null;
                let ele_class = null;
                if (menu.Checked) {
                    out_html =
                        React.createElement("div", {className: "panel-active", key: menu.Key}, React.createElement("div", {className: "panel-heading"}, React.createElement("a", {href: "#", onClick: this.onClick.bind(this, menu.Key), className: "panel-title"}, React.createElement("i", {className: menu.IconClass}), " ", menu.Title)), React.createElement(Collapse, {in: menu.Checked}, React.createElement("div", {className: "panel-collapse"}, React.createElement("ul", {className: "panel-body list-unstyled"}, menu.sub.map((menu_item, j) => {
                            let out_html_sub_item = null;
                            let active_link = null;
                            let link_str = null;
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
                        React.createElement("div", {key: menu.Key}, React.createElement("div", {className: "panel-heading"}, React.createElement("a", {href: "#", onClick: this.onClick.bind(this, menu.Key), className: "panel-title collapsed"}, React.createElement("i", {className: menu.IconClass}), " ", menu.Title)), React.createElement(Collapse, {in: menu.Checked}, React.createElement("div", {className: "panel-collapse"}, React.createElement("ul", {className: "panel-body list-unstyled"}, menu.sub.map((menu_item, j) => {
                            let out_html_sub_item = null;
                            let active_link = null;
                            let link_str = null;
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
        }
    }
    MenuTree.defaultProps = {};
    Menu.MenuTree = MenuTree;
})(Menu || (Menu = {}));
var dom = document.getElementById('sidebar');
ReactDOM.render(React.createElement(Menu.MenuTree, {area: gb_area, controller: gb_controller, action: gb_action, def_action: gb_def_action}), dom);
