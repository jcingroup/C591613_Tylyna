/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    config.skin = 'bootstrapck';
    config.height = 500;
    config.language = 'zh';
    // config.uiColor = '#AADC6E';
    config.extraPlugins = 'youtube';
    //config.extraAllowedContent = 'ul(*);';
    config.contentsCss = ['../../Content/css/editor.css'];
    config.toolbar = [
        {
            name: "basicstyles",
            items: ["FontSize", "Bold", "Underline", "Strike", "-", "JustifyLeft", "JustifyCenter", "JustifyRight", "-", "RemoveFormat"]
        },
        { name: "colors", items: ["TextColor", "BGColor"] },
        { name: "paragraph", items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent"] },
        // { name: "styles", items: ["Styles", "Format"] },
        { name: "styles", items: ["Styles"] },
        { name: "links", items: ["Link", "Unlink", "Anchor"] },
        { name: 'insert', items: ['Image', 'Youtube', 'Table', 'Smiley', 'Iframe'] },
        {
            name: "clipboard",
            items: ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "Undo", "Redo"]
        },
        { name: "document", items: ["Source", "-"] },
        { name: "tools", items: ["Maximize", "-"] },
        { name: "editing" }
    ];
    config.filebrowserBrowseUrl = "../../ckfinder/ckfinder.html";
    config.filebrowserImageBrowseUrl = "../../ckfinder/ckfinder.html?type=Images";
    config.filebrowserImageUploadUrl = "../../ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Images";
    config.autoUpdateElement = true;

    //不要轉換htmltag
    config.allowedContent = true;
    config.fontSize_sizes = '12px/12px;13/13px;16/16px;18/18px;20/20px;22/22px;24/24px;36/36px;48/48px;';
    config.font_names = 'Arial;Arial Black;Comic Sans MS;Courier New;Tahoma;Verdana;新細明體;細明體;標楷體;微軟正黑體';
};

CKEDITOR.stylesSet.add('default', [
    // Block Styles
    // { name: '標題 - 樣式1', element: 'h1', attributes: { 'class': 'colored' } },
    { name: '標題 - 樣式1', element: 'h2', attributes: { 'class': 'colored' } },
    { name: '標題 - 樣式2', element: 'h3', attributes: { 'class': 'colored' } },
    { name: '標題 - 樣式3', element: 'h4', attributes: { 'class': 'colored' } },
    { name: '標題 - 樣式4', element: 'h5', attributes: { 'class': 'colored' } },
    // { name: '標題 - 樣式4', element: 'h6', attributes: { 'class': 'colored' } },
    // { name: '段落 - 引言', element: 'p', attributes: { 'class': 'leading' } },

    // Inline Styles
    // { name: '文字 - 強調1', element: 'strong', attributes: { 'class': 'strong2' } },
    // { name: '文字 - 強調2', element: 'strong', attributes: { 'class': 'strong3' } },
    // { name: '文字 - 裝飾1', element: 'span', attributes: { 'class': 'underline' } },
    // { name: '文字 - 裝飾2', element: 'span', attributes: { 'class': 'arrow-right' } },

    // Object Styles
    { name: '列表-圖示&線', element: 'ul', attributes: { 'class': 'list-icon list-underline' } },
    { name: '列表-圖示', element: 'ul', attributes: { 'class': 'list-icon' } },
    { name: '列表-線', element: 'ul', attributes: { 'class': 'list-unstyled list-underline' } },
    { name: '列表-無圖示', element: 'ul', attributes: { 'class': 'list-unstyled' } },
    { name: '數字列表-線', element: 'ol', attributes: { 'class': 'list-underline' } },
    { name: '表格樣式', element: 'table', attributes: { 'class': 'table' } },
    // { name: '圖片 - 加框', element: 'img', attributes: { 'class': 'thumb' } }
]);