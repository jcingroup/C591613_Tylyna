import {fetchGet, fetchDelete, fetchPost, fetchPut} from '../../ts-comm/ajax';
import {ac_type_comm} from '../../action_type';
import {UIText} from '../../ts-comm/def-data';
import {tosMessage} from '../../ts-comm/comm-func';
import { mask_show, mask_off} from '../../ts-comm/vwMaskLoading';

const apiPath: string = gb_approot + 'Order';
export const callLoad = () => {
    return dispatch => {
        mask_show(UIText.mk_loading);
        return fetchGet(apiPath + '/getCart', {})
            .then((data: IResultData<any>) => {
                mask_off();
                if (data.result) {
                    dispatch(setLoadData(data.data));
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}

export const setLoadData = (items) => {
    return {
        type: ac_type_comm.load,
        items
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

export const delProduct = (p_detial_id: number) => {
    return dispatch => {
        let pm = { p_d_id: p_detial_id };
        mask_show(UIText.mk_updating);
        return fetchPost(apiPath + '/delProductCart', pm)
            .then((data: IResultData<server.PurchaseDetail>) => {
                mask_off();
                if (data.result) {
                    document.getElementById('cart-num').textContent = data.id.toString();
                    dispatch(callLoad());
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}

export const chgProductQty = (p_detial_id: number, qty: number) => {
    return dispatch => {
        let pm = { p_d_id: p_detial_id, qty: qty };
        mask_show(UIText.mk_updating);
        return fetchPost(apiPath + '/chgProductQty', pm)
            .then((data: IResultData<server.PurchaseDetail>) => {
                mask_off();
                if (data.result) {
                    dispatch(callLoad());
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}