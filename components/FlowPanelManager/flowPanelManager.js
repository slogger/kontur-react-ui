/**
 * Created by ilyin on 11.08.2015.
 */

var _ = require("underscore");
var DomUtils = require("./domUtils");
var appendReactToBody = DomUtils.appendReactToBody;


//cfg : render, position
var Panel = function(cfg){
    _.extend(this, {
        render: function(){return (<div>Render func is missing!</div>)},
        align : 'middle-left'
    },cfg);
};

var panels = [];
function updatePanels(){
    _.each(panels, function(p){
        p.updatePosition();
    });
};

DomUtils.addEventListener(window, 'scroll', updatePanels);
DomUtils.addEventListener(window, 'resize', updatePanels);


Panel.prototype = {
    show : function(){
        if (this.visible)
            return;
        this.visible = true;

        if (!this.contentWrap)
            this.contentWrap = appendReactToBody(this.render()).wrap;

        if (!this.panelAppendResult) {
            var layoutCfg = this.getLayout();
            this.position = this.getPosition(layoutCfg);
            var reactPanel = this.renderPanel()
            this.panelAppendResult = DomUtils.appendReactToBody(reactPanel);
            this.contentWrap.style.visibility = '';
            this.contentWrap.style.position = '';
            this.panelAppendResult.rendered.refs.childrenContainer.getDOMNode().appendChild(this.contentWrap);
        }
        this.animateAppear(this.panelAppendResult.wrap, this.position);
    },

    updatePosition : function(){
        if (!this.visible)
            return;

        var layoutCfg = this.getLayout();
        this.position = this.getPosition(layoutCfg);
        this.panelAppendResult.wrap.style.left = this.position.left + 'px';
        this.panelAppendResult.wrap.style.top = this.position.top + 'px';
        this.updatePanel(this.panelAppendResult.rendered);
    },

    getLayout : function(){
        var topLeft = DomUtils.getWindowPosition(this.target);
        return {
            targetRect : {
                top : topLeft.top,
                    left : topLeft.left,
                    width : DomUtils.outerWidth(this.target),
                    height : DomUtils.outerHeight(this.target)
            },
            contentSize : {
                width : DomUtils.outerWidth(this.contentWrap),
                height : DomUtils.outerHeight(this.contentWrap)
            }
        };
    },

    updatePanel : function(panel){
    },

    hide : function(){
        if (!this.visible)
            return;
        this.visible = false;
        this.animateDisappear();
    },

    animateDisappear : function(panelWrap) {
        this.panelAppendResult.wrap.style.visibility = 'hidden';
    },

    animateAppear : function(panelWrap, position) {
        panelWrap.style.visibility = '';
        panelWrap.style.left = position.left + 'px';
        panelWrap.style.top = position.top + 'px';
    },

    renderPanel : function() {
        return <div ref='childrenContainer'></div>;
    },

    getPosition : function(cfg){
        return {
            left: cfg.targetRect.left,
            top : cfg.targetRect.top - cfg.contentSize.height
        };
    }
};

var createPanel = function(cfg){
    var panel = new Panel(cfg);
    panels.push(panel);
    return panel;
};


module.exports = {
    createPanel : createPanel
};