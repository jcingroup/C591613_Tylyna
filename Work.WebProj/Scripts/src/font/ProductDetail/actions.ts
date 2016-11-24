import {fetchGet, fetchDelete, fetchPost, fetchPut} from '../../ts-comm/ajax';
import {ac_type_comm} from '../../action_type';
import {UIText} from '../../ts-comm/def-data';
import {tosMessage} from '../../ts-comm/comm-func';
import { mask_show, mask_off} from '../../ts-comm/vwMaskLoading';


export const setData = (item) => {
    return {
        type: ac_type_comm.load,
        item
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

const apiPath: string = gb_approot + 'Products/addCart';
export const addCart = (md: server.PurchaseDetail) => {
    return dispatch => {
        let pm = { md: md };
        mask_show(UIText.mk_updating);
        return fetchPost(apiPath, pm)
            .then((data: IResultData<server.PurchaseDetail>) => {
                mask_off();
                if (data.result) {
                    //tosMessage(null, UIText.fi_addCart, 1);
                    alert(UIText.fi_addCart);
                    document.getElementById('cart-num').textContent = data.id.toString();
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}