/*
Jerry 2016-06-21
欄位排序 For Grid標題欄使用


 */
import React = require('react');
import ReactDOM = require('react-dom');

export class OrderButton extends React.Component<{
    title: string,
    now_field: string,
    field: string,
    sort: string,
    setSort(field: string, sort: string): void
}, { now_sort: string }> {

    constructor() {
        super();
        this.componentDidMount = this.componentDidMount.bind(this);
        this.setSort = this.setSort.bind(this);
        this.state = {
            now_sort: 'asc'
        };
    }

    static defaultProps = {
        sort: 'asc'
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

        //console.log('now_sort', this.state.now_sort);
        let className = 'th-sort-toggle';
        if (this.props.now_field == this.props.field) {
            if (this.state.now_sort == 'asc') {
                className = 'th-sort-toggle asc';
            }
            if (this.state.now_sort == 'desc') {
                className = 'th-sort-toggle desc';
            }
        }

        return <button type="button" onClick={this.setSort} className={className}>{this.props.title}</button>;
        /*
            預設(還沒按): className="th-sort-toggle"，遞增: className="th-sort-toggle asc"，遞減: className="th-sort-toggle desc"
            如果文字要置中，要另加 className="text-xs-center"
        */
    }
}