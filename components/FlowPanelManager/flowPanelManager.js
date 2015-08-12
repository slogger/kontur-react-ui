/**
 * Created by ilyin on 11.08.2015.
 */

var _ = require("underscore");
var domUtils = require("./domUtils");


var appendReactToBody = function(reactComponent){
    var wrap = document.createElement("div");
    wrap.style.display = 'block';
    wrap.style.position = 'absolute';
    wrap.style.visibility = 'hidden';
    document.body.appendChild(wrap);
    React.render(reactComponent, wrap);
    return wrap;
};

//cfg : render, position
var Panel = function(cfg){
    _.extend(this, {
        render: function(){return (<div>Render func is missing!</div>)},
        align : 'middle-left'
    },cfg);

};

var getPosition = function(cfg){
    console.log(cfg);
    return {
        left: cfg.targetRect.left,
        top : cfg.targetRect.top -cfg.contentSize.height
    };
};


Panel.prototype = {
    show : function(){
        if (!this.panelWrap) {
            if (!this.contentWrap)
                this.contentWrap = appendReactToBody(this.render());
            this.panelWrap = this.renderPanel(this.contentWrap, position);
        }
        var position = this._getPosition(this.contentWrap);
        this.animateAppear(this.panelWrap, position);
    },

    hide : function(){
        if (this.panelWrap)
            this.animateDisappear(this.panelWrap);
    },

    animateDisappear : function(panelWrap) {
        panelWrap.style.visibility = 'hidden';
    },

    animateAppear : function(panelWrap, position) {
        panelWrap.style.visibility = '';
        panelWrap.style.left = position.left + 'px';
        panelWrap.style.top = position.top + 'px';
    }, 

    renderPanel : function(contentWrap, position){
        var s = {display:'block'};
        var panelWrap = appendReactToBody(<div style={s}></div>);
        contentWrap.style.visibility = '';
        contentWrap.style.position = '';
        panelWrap.childNodes[0].appendChild(contentWrap);
        return panelWrap;
    },

    _getPosition : function(contentWrap){
        return getPosition({
            align : this.align,
            targetRect : domUtils.getWindowPosition(this.target),
            contentSize : {
                width : $(contentWrap).width(),
                height : $(contentWrap).height()
            }
        });
    }
};

var createPanel = function(cfg){
    return new Panel(cfg);
};


module.exports = {
    createPanel : createPanel
};