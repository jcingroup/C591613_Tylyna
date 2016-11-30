"use strict";
const React = require('react');
const CommFunc = require('comm-func');
require("../../../Content/css/typeahead.css");
class ReactTypeahead extends React.Component {
    constructor(props) {
        super(props);
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
    onChange(e) {
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
    }
    _onClickItem(i, v, e) {
        this.state.pointIndex = i;
        this.setState({ visibility: false, keyword: v });
        this._Complete();
    }
    _Complete() {
        let idx = this.state.pointIndex;
        let index_value = this.state.data[idx].value;
        let text = this.state.data[idx].text;
        this.props.onCompleteChange(this.props.fieldName, this.props.index, { value: index_value, text: text });
    }
    getData(q) {
        clearTimeout(this.tid);
        this.tid = 0;
        if (this.state.keyword.trim() == '') {
            this.setState({
                visibility: false
            });
        }
        else {
            CommFunc.jqGet(this.props.apiPath, { keyword: q })
                .done((data, textStatus, jqXHRdata) => {
                this.setState({ data: data, visibility: true });
            });
        }
    }
    keyDown(e) {
        if (e.keyCode == 40) {
            if (this.state.pointIndex < this.state.data.length - 1) {
                let new_pos = this.state.pointIndex + 1;
                let index_value = this.state.data[new_pos].value;
                this.setState({ pointIndex: new_pos, keyword: index_value });
            }
        }
        if (e.keyCode == 38) {
            if (this.state.pointIndex > 0) {
                let new_pos = this.state.pointIndex - 1;
                let index_value = this.state.data[new_pos].value;
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
    }
    onBlur(e) {
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.value != nextProps.value) {
            this.setState({ keyword: nextProps.value });
        }
    }
    render() {
        var out_selector = null;
        if (this.state.visibility) {
            out_selector = React.createElement(Selector, {data: this.state.data, pointIndex: this.state.pointIndex, onClickItem: this._onClickItem});
        }
        return (React.createElement("div", {className: this.props.inputClass}, React.createElement("input", {className: "form-control", type: "text", value: this.state.keyword, onChange: this.onChange, onKeyDown: this.keyDown, disabled: this.props.disabled}), out_selector));
    }
}
ReactTypeahead.defaultProps = {
    disabled: false
};
exports.ReactTypeahead = ReactTypeahead;
class Selector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (React.createElement("div", {className: "typeahead-panel list-group"}, this.props.data.map(function (item, i) {
            if (this.props.pointIndex == i) {
                return (React.createElement(Options, {setClass: "list-group-item active", data: item, index: i, key: item.value, onClickItem: this.props.onClickItem}));
            }
            else {
                return (React.createElement(Options, {setClass: "list-group-item", data: item, index: i, key: item.value, onClickItem: this.props.onClickItem}));
            }
        }.bind(this))));
    }
}
Selector.defaultProps = {};
class Options extends React.Component {
    constructor(props) {
        super(props);
        this._onClickItem = this._onClickItem.bind(this);
        this.state = {};
    }
    _onClickItem(v, e) {
        this.props.onClickItem(this.props.index, v, e);
    }
    render() {
        return (React.createElement("a", {className: this.props.setClass, href: "#", onClick: this._onClickItem.bind(this, this.props.data.value)}, this.props.data.text));
    }
}
Options.defaultProps = {
    setClass: 'list-group-item'
};
