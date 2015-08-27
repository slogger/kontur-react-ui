/**
 * Created by ilyin on 12.08.2015.
 */

module.exports = {
    removeClass : function(el, className) {
        if (!this.hasClass(el, className))
            return;

        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    },

    addClass : function(el, className) {
        if (this.hasClass(el, className))
            return;

        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    },

     hasClass : function(el, className) {
         if (el.classList)
             return el.classList.contains(className);
         else
             return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
     },

     ready : function(fn) {
         if (document.readyState != 'loading') {
             fn();
         } else if (document.addEventListener) {
             document.addEventListener('DOMContentLoaded', fn);
         } else {
             document.attachEvent('onreadystatechange', function () {
                 if (document.readyState != 'loading')
                     fn();
             });
         }
     },

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
        document.body.appendChild(wrap);
        var rendered = React.render(reactComponent, wrap);
        return {
            wrap :wrap,
            rendered : rendered
        };
    }
}