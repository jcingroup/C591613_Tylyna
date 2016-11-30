import {fetchGet, fetchDelete, fetchPost, fetchPut} from '../../ts-comm/ajax';
import {ac_type_comm} from '../../action_type';
import {UIText} from '../../ts-comm/def-data';
import {tosMessage} from '../../ts-comm/comm-func';
import { mask_show, mask_off} from '../../ts-comm/vwMaskLoading';


//ajax--
const apiPath: string = gb_approot + 'api/Purchase';
export const callLoad = (no: string) => {
    return dispatch => {
        let pm = { no: no };
        mask_show(UIText.mk_loading);
        return fetchGet(apiPath + "/getRemitData", pm)
            .then((data: IResultData<server.Purchase>) => {
                mask_off();
                if (data.result) {
                    dispatch(setData(data.data));
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}

export const callSumbit = (md: server.Purchase) => {
    return dispatch => {
        mask_show(UIText.mk_updating);
        return fetchPost(apiPath + '/upRemitData', md)
            .then((data: IResultData<server.Purchase>) => {
                mask_off();
                if (data.result) {
                    dispatch(chgOperPage(OrderOperatorType.Finish));
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}
//ajax--
export const setData = (data: server.Purchase) => {
    return {
        type: ac_type_comm.load,
        item: data
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

