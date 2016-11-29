import {fetchGet, fetchDelete, fetchPost, fetchPut} from '../ts-comm/ajax';
import {ac_type_comm, remit_type} from '../action_type';
import {UIText} from '../ts-comm/def-data';
import {tosMessage} from '../ts-comm/comm-func';
import { mask_show, mask_off} from '../ts-comm/vwMaskLoading';

//ajax--
const apiPath: string = gb_approot + 'api/Purchase';
export const callGridLoad = (search: any) => {
    return dispatch => {
        mask_show(UIText.mk_loading);
        let pm = search == null ? { keyword: null } : search;
        return fetchGet(apiPath + '/getRemitList', pm)
            .then((data) => {
                mask_off();
                dispatch(getGridItem(data));
            })
            .catch((reason) => { mask_off(); })
    }
}

export const updateRemitState = (state: number, arr: Array<string>) => {
    return dispatch => {
        let pm = { state: state, arr: arr };

        mask_show(UIText.mk_updating);
        return fetchPost(apiPath + '/upRemitState', pm)
            .then((data: IResultData<server.Purchase>) => {
                mask_off();
                if (data.result) {
                    tosMessage(null, UIText.fi_update, 1);
                    dispatch(callGridLoad(null));
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
        items: data.rows,
        pageinfo: {
            total: data.total,
            page: data.page,
            records: data.records,
            startcount: data.startcount,
            endcount: data.endcount,
            field: data.field,
            sort: data.sort
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

export const setRemitCheck = (data) => {
    return {
        type: remit_type.chg_remit_list,
        data
    }
}