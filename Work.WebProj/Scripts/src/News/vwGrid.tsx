import React = require('react');
import Moment = require('moment');
import {config} from '../ts-comm/def-data';
import {ac_type_comm} from '../action_type';
import {TagShowAndHide, PWButton} from '../components';
//view
import {GridTableView} from './containers';
import {GridSearch} from './vwGridSearch';
import {NavPage} from '../components';

export class Grid extends React.Component<any, { infoShow: boolean }>{

    constructor() {
        super();
        this.queryGridData = this.queryGridData.bind(this);

        this.addState = this.addState.bind(this);

        this.state = {
            infoShow: true
        };
    }
    queryGridData(page?: number) {//navpage 用
        let params = this.props.search;

        params['page'] = page == null ? this.props.page_operator.page : page;

        this.props.callGridLoad(params);
    }
    addState() {
        let data: server.News = {
            news_id: 0,
            news_title: '',
            day: Moment().format(config.dateFT),
            news_content: null,
            no_index: true,
            sort: 0,
            i_Hide: false,
            i_Lang: 'zh-TW'
        };
        this.props.editState(ac_type_comm.add, 0, data);
    }
    hideInfo(e) {
        this.setState({ infoShow: false });
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let p_info: server.PageInfo = pp.page_operator;
        let grid: Array<server.News> = pp.grid;
        out_html =
            (
                <div>
                    <h3 className="h3">
                        {gb_caption}
                    </h3>
                    <TagShowAndHide show={this.state.infoShow} TagName={TagName.div}  className="alert alert-warning">
                        <PWButton className="close" iconClassName="fa-times" enable={true} onClick={this.hideInfo.bind(this) } />
                        首頁顯示最多3則
                    </TagShowAndHide>
                    <GridSearch search={pp.search} page_operator={pp.page_operator}
                        setInputValue={this.props.setInputValue}
                        callGridLoad={this.props.callGridLoad}/>
                    <GridTableView />
                    <NavPage
                        page={p_info.page}
                        startcount={p_info.startcount}
                        endcount={p_info.endcount}
                        total={p_info.total}
                        records={p_info.records}
                        mapPage={this.queryGridData}
                        clickInsertState={this.addState}
                        showDelete={false}/>
                </div>
            );

        return out_html;
    }
}