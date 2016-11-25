import $ = require('jquery');
import {fetchPost} from '../ts-comm/ajax';

// 頁籤切換
var tab = $('.js-tab');
var tabContent = '.tab-content';
$('.tab-content:gt(0)').hide();
// $(tab.eq(0).addClass('active').attr('href')).siblings(tabContent).hide();
tab.click(function () {
    event.preventDefault();
    $($(this).attr('href')).fadeIn().siblings(tabContent).hide();
    $(this).toggleClass('active');
    tab.not(this).removeClass('active');
});


$('.scroll').click(function (event) {
    $('html, body').animate({
        scrollTop: $($(this).attr(this, 'href')).offset().top - 50
    }, 750);
    event.preventDefault();
});
$('.goTop').click(function () {
    $('body, html').stop(true).animate({ scrollTop: 0 }, 750);
    event.preventDefault();
});

// 縮放特效
var $collapse = $("[data-toggle='collapse']");
var fall = '.collapse-content';

$collapse.click(function () {
    $(this).next(fall).slideToggle();
    $(this).parent().siblings().children().next().slideUp(100);
    // $(this).siblings().next(fall).slideUp();
    $(this).toggleClass("current"),
        $collapse.not(this).removeClass("current");
    return false;
});


// 行動裝置的主選單
let $menuLeft = $('#menu');
let $trigger = $('.mobile-trigger');

$trigger.click(function () {
    $(this).toggleClass('active');
    $('body').toggleClass('push');
});
$('.toggle').click(function () {
    $('body').removeClass('push');
});

//登入會員彈出視窗
$("#Btn_Mlogin").click(() => {
    $("#login").css('display', 'block');
    //按下登入會員按鈕時,頁簽一定要再第一個
    $("#MLogin").fadeIn().siblings(tabContent).hide();
});

namespace MemberLogin {
    interface LoginData {
        account?: string;
        password?: string;
        validate?: string;
        lang?: string;
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

    $("#MLogin").submit(function (event) {
        event.preventDefault();
        let data: LoginData = {
            "account": $("#m_act").val(),
            "password": $("#m_pwd").val(),
            "validate": $("#g-recaptcha-response").val(),
            "lang": 'zh-TW'
        };

        mask_show();
        fetchPost(gb_approot + 'Base/Login/member_Login', data)
            .then((data: LoginResult) => {
                mask_off();
                if (data.result) {
                    //document.location.href = data.url;
                    document.location.reload();
                }
                else {
                    $("#m_pwd").val("");
                    //$("#m_login_img").attr("src", "/_Code/Ashx/ValidateCode.ashx?vn=CheckCode&t" + (new Date()).getTime());
                    //$("#m_Validate").val("");
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    });
}