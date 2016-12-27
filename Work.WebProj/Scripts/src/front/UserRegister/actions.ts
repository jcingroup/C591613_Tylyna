import {fetchGet, fetchDelete, fetchPost, fetchPut} from '../../ts-comm/ajax';
import {ac_type_comm} from '../../action_type';
import {UIText} from '../../ts-comm/def-data';
import {tosMessage} from '../../ts-comm/comm-func';
import { mask_show, mask_off} from '../../ts-comm/vwMaskLoading';


//ajax--
const apiPath: string = gb_approot + 'api/FrontUser';

export const callSumbit = (md: server.Customer) => {
    return dispatch => {
        mask_show(UIText.mk_updating);
        return fetchPost(apiPath, md)
            .then((data: IResultData<server.Customer>) => {
                mask_off();
                if (data.result) {
                    tosMessage(null, UIText.fi_addCustomer, 1);
                    dispatch(chgOperPage(OperatorType.Finish));
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }
}
//ajax--
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


