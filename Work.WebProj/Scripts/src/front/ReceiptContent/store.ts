import update = require('react-addons-update');
import { combineReducers } from 'redux'
import {ac_type_comm} from '../../action_type';

let init_f: server.Purchase = {
    purchase_no: '',
    remit_money: 0,
    Deatil:[]
};
const field = (state: server.Purchase = init_f, action) => {
    switch (action.type) {
        case ac_type_comm.load:
            return action.data;
        default:
            return state
    }
}

export const combine = combineReducers({
    field
})

export default combine;