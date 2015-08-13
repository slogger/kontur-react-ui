/**
 * Created by ilyin on 12.08.2015.
 */

module.exports = {

    addEventListener : function(el, eventName, handler) {
        if (el.addEventListener) {
            el.addEventListener(eventName, handler);
        } else {
            el.attachEvent('on' + eventName, function () {
                handler.call(el);
            });
        }
    },

    outerWidth: function (el, includeMargin) {
        if (!includeMargin)
            return el.offsetWidth;

        var width = el.offsetWidth;
        var style = el.currentStyle || getComputedStyle(el);

        width += parseInt(style.marginLeft) + parseInt(style.marginRight);
        return width;
    },

    outerHeight: function (el, includeMargin) {
        if (!includeMargin)
            return el.offsetHeight;

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
    },

    appendReactToBody : function(reactComponent){
        var wrap = document.createElement("div");
        wrap.style.display = 'block';
        wrap.style.position = 'absolute';
        wrap.style.visibility = 'hidden';
        document.body.appendChild(wrap);
        var rendered = React.render(reactComponent, wrap);
        return {
            wrap :wrap,
            rendered : rendered
        };
    }
}