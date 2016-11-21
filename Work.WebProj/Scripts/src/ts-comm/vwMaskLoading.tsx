import React = require('react');
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {uniqid} from './comm-func';

namespace MaskLoadingFunc {

    interface MaskLoadingProps {
        is_show?: boolean,
        text?: string;
    }
    class MaskLoading extends React.Component<MaskLoadingProps, any>{

        constructor() {
            super();
        }
        static defaultProps = {
            is_loading: false,
            text: '資料讀取中……'
        }
        render() {
            let out_html = this.props.is_show ? <div className="loading">
                <div className="loader" data-loader="circle-side"></div>
                <p>{this.props.text}</p>
            </div> : null;

            return out_html;
        }
    }

    const MaskLoadingToProps = (state, ownProps) => {
        let ld = state.mask_loading
        return {
            is_show: ld.is_show,
            text: ld.text
        }
    }
    const MaskLoadingDispatch = (dispatch, ownProps) => {
        let s = bindActionCreators({}, dispatch);
        return s;
    }
    export const MaskView = connect<{}, {}, MaskLoadingProps>(MaskLoadingToProps, MaskLoadingDispatch)(MaskLoading)

    let mask_div_id = 'mask_unique_' + uniqid();
    export let mask_show = (text = '資料讀取中……') => {
        //let body = document.getElementById('wrapper');
        let body = document.getElementsByTagName("BODY")[0];
        let _div = document.createElement('div');
        _div.id = mask_div_id;
        _div.className = 'loading';
        _div.innerHTML = '<div class="loader" data-loader="circle-side"></div><p>' + text + '</p>';
        body.appendChild(_div);
    }
    export let mask_off = () => {
        let body = document.getElementsByTagName("BODY")[0];
        if (body) {
            let _div = document.getElementById(mask_div_id);
            body.removeChild(_div);
        }
    }
}

export = MaskLoadingFunc;