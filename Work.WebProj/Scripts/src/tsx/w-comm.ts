import $ = require('jquery');
import {fetchPost, fetchGet} from '../ts-comm/ajax';
import { mask_show, mask_off} from '../ts-comm/vwMaskLoading';
import {UIText} from '../ts-comm/def-data';

// 控制卷軸特效
$('.scroll').click(function () {
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top - 50
    }, 750);
    return false;
});
$('.goTop').click(function() {
    $('body, html').stop(true).animate({scrollTop:0},750);
    return false;
});

// 頁籤切換
var tab = $('.js-tab');
var tabContent = '.tab-content';
$(tabContent).slice(1).hide();
// $(tab.eq(0).addClass('active').attr('href')).siblings(tabContent).hide();
tab.click(function () {
    event.preventDefault();
    $($(this).attr('href')).fadeIn().siblings(tabContent).hide();
    $(this).toggleClass('active');
    tab.not(this).removeClass('active');
});

$(window).scroll(function () {
    // 卷動到定位時固定位置
    var scroll = $(window).scrollTop(),
        top = $('#menu'),
        topHeight = top.height() + 110;

    if (scroll >= $('#header').height()) {
        top.addClass('fixed');
        $('.top-nav').addClass('fixed');
        $('#main').css('padding-top', topHeight);
    } else {
        top.removeClass('fixed');
        $('.top-nav').removeClass('fixed');
        $('#main').removeAttr('style');
    }
});

// 縮放特效
var $collapse = $("[data-toggle='collapse']");
var fall = '.collapse-content';
// 除第一個外隱藏
$(fall).slice(1).hide();
$collapse.click(function () {
    $(this).next(fall).slideToggle();
    $(this).parent().siblings().children().next().slideUp(100);
    // $(this).siblings().next(fall).slideUp();
    $(this).toggleClass("current"),
        $collapse.not(this).removeClass("current");
    return false;
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
        nothaveAccount: boolean;
    }

    $("#MLogin").submit(function (event) {
        event.preventDefault();
        let data: LoginData = {
            "account": $("#m_act").val(),
            "password": $("#m_pwd").val(),
            "validate": $("#g-recaptcha-response").val(),
            "lang": 'zh-TW'
        };

        //mask_show(UIText.mk_login);
        fetchPost(gb_approot + 'Base/Login/member_Login', data)
            .then((data: LoginResult) => {
                //mask_off();
                if (data.result) {
                    //document.location.href = data.url;
                    document.location.reload();
                }
                else {
                    $("#m_pwd").val("");
                    grecaptcha.reset(widgetId);
                    //$("#m_login_img").attr("src", "/_Code/Ashx/ValidateCode.ashx?vn=CheckCode&t" + (new Date()).getTime());
                    //$("#m_Validate").val("");
                    if (data.nothaveAccount) {
                        if (!confirm(UIText.register_sure)) {
                            return;
                        }
                        document.location.href = data.url;
                    } else {
                        alert(data.message);
                    }
                }
            })
            .catch((reason) => { mask_off(); })
    });

    function sendForgotPWMail(d) {
        mask_show(UIText.mk_mail);
        fetchGet(gb_approot + 'api/FrontUser/forgotPWSendMail', { email: d })
            .then((data: LoginResult) => {
                mask_off();
                if (data.result) {
                    alert("Email已成功送出,請至信箱確認.");
                } else {
                    alert(data.message);
                }
            })
            .catch((reason) => { mask_off(); })
    }

    $("#MForgotPW").submit(function (event) {
        event.preventDefault();
        let data: string = $("#m_email").val();
        sendForgotPWMail(data);
    });
    $("#ResetMForgogPW").submit(function (event) {
        event.preventDefault();
        let data: string = $("#rm_email").val();
        sendForgotPWMail(data);
    });
}