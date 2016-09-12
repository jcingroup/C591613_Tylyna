"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var CommFunc = require('comm-func');
require("../../../Content/css/typeahead.css");
var ReactTypeahead = (function (_super) {
    __extends(ReactTypeahead, _super);
    function ReactTypeahead(props) {
        _super.call(this, props);
        this.tid = 0;
        this.onChange = this.onChange.bind(this);
        this._onClickItem = this._onClickItem.bind(this);
        this._Complete = this._Complete.bind(this);
        this.getData = this.getData.bind(this);
        this.keyDown = this.keyDown.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.state = {
            inputValue: null,
            keyword: this.props.value,
            visibility: false,
            tid: null,
            data: [],
            pointIndex: -1
        };
    }
    ReactTypeahead.prototype.onChange = function (e) {
        var v = e.target.value;
        if (v.trim() != '') {
            this.setState({
                keyword: v
            });
            var _this = this;
            var f = function () { _this.getData(v); };
            clearTimeout(this.tid);
            this.tid = setTimeout(f, 500);
        }
        else {
            this.setState({
                keyword: v,
                visibility: false
            });
        }
    };
    ReactTypeahead.prototype._onClickItem = function (i, v, e) {
        this.state.pointIndex = i;
        this.setState({ visibility: false, keyword: v });
        this._Complete();
    };
    ReactTypeahead.prototype._Complete = function () {
        var idx = this.state.pointIndex;
        var index_value = this.state.data[idx].value;
        var text = this.state.data[idx].text;
        this.props.onCompleteChange(this.props.fieldName, this.props.index, { value: index_value, text: text });
    };
    ReactTypeahead.prototype.getData = function (q) {
        var _this = this;
        clearTimeout(this.tid);
        this.tid = 0;
        if (this.state.keyword.trim() == '') {
            this.setState({
                visibility: false
            });
        }
        else {
            CommFunc.jqGet(this.props.apiPath, { keyword: q })
                .done(function (data, textStatus, jqXHRdata) {
                _this.setState({ data: data, visibility: true });
            });
        }
    };
    ReactTypeahead.prototype.keyDown = function (e) {
        if (e.keyCode == 40) {
            if (this.state.pointIndex < this.state.data.length - 1) {
                var new_pos = this.state.pointIndex + 1;
                var index_value = this.state.data[new_pos].value;
                this.setState({ pointIndex: new_pos, keyword: index_value });
            }
        }
        if (e.keyCode == 38) {
            if (this.state.pointIndex > 0) {
                var new_pos = this.state.pointIndex - 1;
                var index_value = this.state.data[new_pos].value;
                this.setState({ pointIndex: new_pos, keyword: index_value });
            }
        }
        if (e.keyCode == 13) {
            this.setState({ pointIndex: -1, visibility: false });
            this._Complete();
        }
        if (e.keyCode == 27) {
            this.setState({ pointIndex: -1, visibility: false, keyword: this.props.value });
        }
    };
    ReactTypeahead.prototype.onBlur = function (e) {
    };
    ReactTypeahead.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.props.value != nextProps.value) {
            this.setState({ keyword: nextProps.value });
        }
    };
    ReactTypeahead.prototype.render = function () {
        var out_selector = null;
        if (this.state.visibility) {
            out_selector = React.createElement(Selector, {data: this.state.data, pointIndex: this.state.pointIndex, onClickItem: this._onClickItem});
        }
        return (React.createElement("div", {className: this.props.inputClass}, React.createElement("input", {className: "form-control", type: "text", value: this.state.keyword, onChange: this.onChange, onKeyDown: this.keyDown, disabled: this.props.disabled}), out_selector));
    };
    ReactTypeahead.defaultProps = {
        disabled: false
    };
    return ReactTypeahead;
}(React.Component));
exports.ReactTypeahead = ReactTypeahead;
var Selector = (function (_super) {
    __extends(Selector, _super);
    function Selector(props) {
        _super.call(this, props);
        this.state = {};
    }
    Selector.prototype.render = function () {
        return (React.createElement("div", {className: "typeahead-panel list-group"}, this.props.data.map(function (item, i) {
            if (this.props.pointIndex == i) {
                return (React.createElement(Options, {setClass: "list-group-item active", data: item, index: i, key: item.value, onClickItem: this.props.onClickItem}));
            }
            else {
                return (React.createElement(Options, {setClass: "list-group-item", data: item, index: i, key: item.value, onClickItem: this.props.onClickItem}));
            }
        }.bind(this))));
    };
    Selector.defaultProps = {};
    return Selector;
}(React.Component));
var Options = (function (_super) {
    __extends(Options, _super);
    function Options(props) {
        _super.call(this, props);
        this._onClickItem = this._onClickItem.bind(this);
        this.state = {};
    }
    Options.prototype._onClickItem = function (v, e) {
        this.props.onClickItem(this.props.index, v, e);
    };
    Options.prototype.render = function () {
        return (React.createElement("a", {className: this.props.setClass, href: "#", onClick: this._onClickItem.bind(this, this.props.data.value)}, this.props.data.text));
    };
    Options.defaultProps = {
        setClass: 'list-group-item'
    };
    return Options;
}(React.Component));
