import {fetchGet, fetchDelete, fetchPost, fetchPut} from '../../ts-comm/ajax';
import {ac_type_comm} from '../../action_type';
import {UIText} from '../../ts-comm/def-data';
import {tosMessage} from '../../ts-comm/comm-func';
import { mask_show, mask_off} from '../../ts-comm/vwMaskLoading';
import { Init_Data} from './pub';

export const setData = (data: Init_Data) => {
    return {
        type: ac_type_comm.load,
        item: data.purchase,
        ship: data.ship
    }
}

export const setInputValue = (type, name, value) => {
    return {
        type: type,
        name,
        value
    }
}

export const chgOperPage = (data) => {
    return {
        type: ac_type_comm.chg_oper_page,
        data
    }
}

const apiPath: string = gb_approot + 'Order';
export const callSumbit = (md: server.Purchase) => {
    return dispatch => {
        let pm = { md: md };
        mask_show(UIText.mk_updating);
        return fetchPost(apiPath + '/setOrder', pm)
            .then((data: IResultData<server.PurchaseDetail>) => {
                mask_off();
                if (data.result) {
                    dispatch(setInputValue(ac_type_comm.chg_fld_val, "purchase_no", data.no));
                    dispatch(chgOperPage(OrderOperatorType.Finish));
                    //alert(data.message);
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}