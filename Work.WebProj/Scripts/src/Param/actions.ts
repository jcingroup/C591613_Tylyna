import {fetchGet, fetchDelete, fetchPost, fetchPut} from '../ts-comm/ajax';
import {ac_type_comm} from '../action_type';
import {UIText} from '../ts-comm/def-data';
import {tosMessage} from '../ts-comm/comm-func';
import { mask_show, mask_off} from '../ts-comm/vwMaskLoading';
import {Init_Params, ajaxParams} from './pub';

//ajax--
const apiPath: string = gb_approot + 'api/Param';
export const callParamLoad = () => {
    return dispatch => {
        mask_show(UIText.mk_loading);
        return fetchGet(apiPath, {})
            .then((data: IResultData<ajaxParams>) => {
                mask_off();
                if (data.result) {
                    dispatch(getParamItem(data.data));
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}
export const callSubmit = (md: ajaxParams) => {
    return dispatch => {
        let pm = {  md: md };

        mask_show(UIText.mk_updating);
        return fetchPost(apiPath, md)
            .then((data: IResultData<ajaxParams>) => {
                mask_off();
                if (data.result) {
                    tosMessage(null, UIText.fi_update, 1);
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}


//ajax--
const getParamItem = (data: ajaxParams) => {
    return {
        type: ac_type_comm.load,
        items: data.ship,
        params: {
            Email: data.Email,
            //匯款帳戶資料
            AccountName: data.AccountName,
            BankName: data.BankName,
            BankCode: data.BankCode,
            AccountNumber: data.AccountNumber
        }
    }
}

export const setInputValue = (type, name, value) => {
    return {
        type: type,
        name,
        value
    }
}
export const setRowInputValue = (type, i, name, value) => {
    return {
        type: type,
        i,
        name,
        value
    }
}
