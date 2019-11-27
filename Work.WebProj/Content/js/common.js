
$('.scroll').click(function (event) {
    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top - 50
    }, 750);
    event.preventDefault();
});
$('.goTop').click(function() {
    $('body, html').stop(true).animate({scrollTop:0},750);
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
$menuLeft = $('#menu');
$trigger = $('.mobile-trigger');

$trigger.click(function() {
    $(this).toggleClass('active');
    $('body').toggleClass('push');
});
$('.toggle').click(function() {
    $('body').removeClass('push');
});
