import {fetchGet, fetchDelete, fetchPost, fetchPut} from '../../ts-comm/ajax';
import {ac_type_comm} from '../../action_type';
import {UIText} from '../../ts-comm/def-data';
import {tosMessage} from '../../ts-comm/comm-func';
import { mask_show, mask_off} from '../../ts-comm/vwMaskLoading';
import { Search_Data} from './pub';


//ajax--
const apiPath: string = gb_approot + 'api/FrontUser';

export const callItem = (no: string) => {
    return dispatch => {
        mask_show(UIText.mk_updating);
        return fetchGet(apiPath + '/getReceiptItem', { no: no })
            .then((data: IResultData<server.Purchase>) => {
                mask_off();
                if (data.result) {
                    dispatch(getFieldData(data.data));
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}
//ajax--
const getFieldData = (data) => {
    return {
        type: ac_type_comm.load,
        data
    }
}

export const setInputValue = (type, name, value) => {
    return {
        type: type,
        name,
        value
    }
}


