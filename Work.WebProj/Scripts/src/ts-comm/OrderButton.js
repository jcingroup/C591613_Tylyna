"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var OrderButton = (function (_super) {
    __extends(OrderButton, _super);
    function OrderButton() {
        _super.call(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.setSort = this.setSort.bind(this);
        this.state = {
            now_sort: 'asc'
        };
    }
    OrderButton.prototype.setSort = function () {
        if (this.state.now_sort == 'asc') {
            this.props.setSort(this.props.field, 'desc');
            this.setState({ now_sort: 'desc' });
        }
        if (this.state.now_sort == 'desc') {
            this.props.setSort(this.props.field, 'asc');
            this.setState({ now_sort: 'asc' });
        }
    };
    OrderButton.prototype.componentDidMount = function () {
        if (this.props.sort != undefined && this.props.sort != null) {
            this.setState({ now_sort: this.props.sort });
        }
    };
    OrderButton.prototype.render = function () {
        var className = 'th-sort-toggle';
        if (this.props.now_field == this.props.field) {
            if (this.state.now_sort == 'asc') {
                className = 'th-sort-toggle asc';
            }
            if (this.state.now_sort == 'desc') {
                className = 'th-sort-toggle desc';
            }
        }
        return React.createElement("button", {type: "button", onClick: this.setSort, className: className}, this.props.title);
    };
    OrderButton.defaultProps = {
        sort: 'asc'
    };
    return OrderButton;
}(React.Component));
exports.OrderButton = OrderButton;
