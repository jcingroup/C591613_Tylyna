import React = require('react');
import Moment = require('moment');
import {config, UIText} from '../ts-comm/def-data';
import {TagShowAndHide, PWButton} from '../components';
import {IEditorState} from './pub';

import {EditDetailView} from './containers';
import {HeadView} from '../ts-comm/vwHeadView';

export class AStart extends React.Component<any, any>{

    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = { };
    }
    handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let field: server.Editor_L1 = this.props.field;
        let pp = this.props;

        this.props.callSubmit(pp.params.id, field, pp.edit_type);
        return;
    }
    hideInfo(e) {
        this.setState({ infoShow: false });
    }
    render() {
        let out_html: JSX.Element = null;
        let pp = this.props;
        let field: server.Editor_L1 = pp.field;
        let view_mode: InputViewMode = InputViewMode.edit;

        out_html =
            (
                <div>
                    <HeadView />
                    <form className="form form-sm" onSubmit={this.handleSubmit}>
                        <h3 className="h3">
                            {gb_caption}<small className="sub"><i className="fa-angle-double-right"></i> {UIText.edit}</small>
                        </h3>
                        <div className="alert alert-warning text-sm">
                            <TagShowAndHide TagName={TagName.Span} show={!field.hide_sort}>
                                <strong>排序注意事項: </strong><br/>
                                <span>點選 </span><strong className="fa-bars"></strong><span> 並</span><strong>拖曳</strong><span>，可修改排列順序。</span><br />
                            </TagShowAndHide>
                            <strong>編輯器注意事項: </strong><br/>
                            從 WORD 複製文字時，請使用下方的 <img src="/Content/images/icon-word.jpg" /> 圖示來貼上 WORD 文字，避免跑版<br/>
                            編輯器上傳圖片或新增表格等時，請勿設定寬度及高度(將數字刪除) ，以免行動裝置顯示時會跑版。<br/>
                            檔案尺寸寬度超過 1600 或 高度超過1200 的圖片會被壓縮(PNG透明背景會變成不透明) <br/>
                            youtube 可勾選「用自適應縮放模式」
                        </div>
                        <EditDetailView />

                        <div className="form-action  text-xs-center">
                            <PWButton iconClassName="fa-check" className="btn btn-primary btn-sm"
                                title={UIText.save} enable={true} type="submit" >{UIText.save}</PWButton> { }
                        </div>

                    </form>
                </div>
            );

        return out_html;
    }
}