import {fetchGet, fetchDelete, fetchPost, fetchPut} from '../ts-comm/ajax';
import {ac_type_comm, remit_type} from '../action_type';
import {UIText} from '../ts-comm/def-data';
import {tosMessage} from '../ts-comm/comm-func';
import { mask_show, mask_off} from '../ts-comm/vwMaskLoading';
import {ShipData} from './pub';

//ajax--
const apiPath: string = gb_approot + 'api/Purchase';
export const callGridLoad = (search: any) => {
    return dispatch => {
        mask_show(UIText.mk_loading);
        let pm = search == null ? { keyword: null } : search;
        return fetchGet(apiPath + '/getShipList', pm)
            .then((data: IResultData<ShipData>) => {
                mask_off();
                if (data.result) {
                    dispatch(getGridItem(data.data));
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}

interface IResultDetail {
    result?: boolean,
    message?: string,
    data?: ShipData,
}
export const callDetailLoad = (i: number, search: any) => {
    return dispatch => {
        mask_show(UIText.mk_loading);
        let pm = search == null ? { keyword: null } : search;
        return fetchGet(apiPath + '/getShipDetail', pm)
            .then((data: IResultDetail) => {
                mask_off();
                if (data.result) {
                    dispatch(getDetailData(i, data.data));
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}
//ajax--


const getGridItem = (data) => {
    return {
        type: ac_type_comm.load,
        items: data
    }
}

export const setInputValue = (type, name, value) => {
    return {
        type: type,
        name,
        value
    }
}

export const getDetailData = (i, data) => {
    return {
        type: ac_type_comm.get_dil_data,
        i,
        data
    }
}