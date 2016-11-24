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