import $ = require('jquery');
import {fetchPost, fetchGet} from '../ts-comm/ajax';
import {tosMessage} from '../ts-comm/comm-func';

declare var mail: string;
declare var code: string;
namespace MemberChgPW {
    interface ChgPwData {
        code?: string;
        Email?: string;
        NewPassword?: string;
        ConfirmPassword?: string;
    }
    interface LoginResult {
        result: boolean;
        message: string;
        url: string;
    }

    let mask_div_id = 'mask_unique_login';

    let mask_show = (text = '登錄中…') => {
        //let body = document.getElementById('wrapper');
        let body = document.getElementsByTagName("BODY")[0];
        let _div = document.createElement('div');
        _div.id = mask_div_id;
        _div.className = 'loading';
        _div.innerHTML = '<div class="loader" data-loader="circle-side"></div><p>' + text + '</p>';
        body.appendChild(_div);
    }
    let mask_off = () => {
        let body = document.getElementsByTagName("BODY")[0];
        let _div = document.getElementById(mask_div_id);
        body.removeChild(_div);
    }

    $("#FPWChg").submit(function (event) {
        event.preventDefault();
        let data: ChgPwData = {
            code: code,
            Email: mail,
            NewPassword: $("#f_newpw").val(),
            ConfirmPassword: $("#f_cfpw").val()
        };
        mask_show();
        fetchPost(gb_approot + 'api/FrontUser/chgPWbyFG', data)
            .then((data: LoginResult) => {
                mask_off();
                if (data.result) {
                    //tosMessage(null, data.message, 1);
                    alert(data.message);
                    document.location.href = "http://" + location.host;
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    });
}