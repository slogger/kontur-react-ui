/**
 * Created by ilyin on 12.08.2015.
 */

module.exports = {
    outerWidth: function (el) {
        var width = el.offsetWidth;
        var style = el.currentStyle || getComputedStyle(el);

        width += parseInt(style.marginLeft) + parseInt(style.marginRight);
        return width;
    },

    outerHeight: function (el) {
        var height = el.offsetHeight;
        var style = el.currentStyle || getComputedStyle(el);
        height += parseInt(style.marginTop) + parseInt(style.marginBottom);
        return height;
    },

    getWindowPosition : function(el) {
        return $(el).offset();
        return {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        };
    }
}