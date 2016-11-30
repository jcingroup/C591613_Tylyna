"use strict";
const React = require('react');
class OrderButton extends React.Component {
    constructor() {
        super();
        this.componentDidMount = this.componentDidMount.bind(this);
        this.setSort = this.setSort.bind(this);
        this.state = {
            now_sort: 'asc'
        };
    }
    setSort() {
        if (this.state.now_sort == 'asc') {
            this.props.setSort(this.props.field, 'desc');
            this.setState({ now_sort: 'desc' });
        }
        if (this.state.now_sort == 'desc') {
            this.props.setSort(this.props.field, 'asc');
            this.setState({ now_sort: 'asc' });
        }
    }
    componentDidMount() {
        if (this.props.sort != undefined && this.props.sort != null) {
            this.setState({ now_sort: this.props.sort });
        }
    }
    render() {
        let className = 'th-sort-toggle';
        if (this.props.now_field == this.props.field) {
            if (this.state.now_sort == 'asc') {
                className = 'th-sort-toggle asc';
            }
            if (this.state.now_sort == 'desc') {
                className = 'th-sort-toggle desc';
            }
        }
        return React.createElement("button", {type: "button", onClick: this.setSort, className: className}, this.props.title);
    }
}
OrderButton.defaultProps = {
    sort: 'asc'
};
exports.OrderButton = OrderButton;
