/**
 * Created by ilyin on 12.08.2015.
 */

var FlowPanelManager = require("../FlowPanelManager");
var DomUtils = require("../FlowPanelManager/domUtils");
var TooltipBox = require("./TooltipBox.jsx");

var offset = 0;
var vPadding = 3;
var hPadding = 5;
var pinHeight = 8;
var pinWidth = 10;
var pinOffset = 10;

var calculators  = {
    'top-left' : function(cfg) {
        return {
            left: cfg.targetRect.left,
            top: cfg.targetRect.top - cfg.contentSize.height - pinHeight - vPadding*2 - offset,
            offset: pinOffset,
            pos : 'bottom'
        };
    },

    'top-center' : function(cfg) {
        return {
            left: cfg.targetRect.left + cfg.targetRect.width/2 - cfg.contentSize.width/2 -hPadding,
            top: cfg.targetRect.top - cfg.contentSize.height - pinHeight - vPadding*2 - offset,
            offset: cfg.contentSize.width/2-pinWidth/2,
            pos : 'bottom'
        };
    },

    'top-right' : function(cfg) {
        return {
            left: cfg.targetRect.left + cfg.targetRect.width  - cfg.contentSize.width -hPadding*2 ,
            top: cfg.targetRect.top - cfg.contentSize.height - pinHeight - vPadding*2 - offset,
            offset: cfg.contentSize.width-pinOffset-pinHeight,
            pos : 'bottom'

        };
    },

    'bottom-left' : function(cfg) {
        return {
            left: cfg.targetRect.left,
            top: cfg.targetRect.height +  cfg.targetRect.top  + pinHeight + offset,
            offset: pinOffset,
            pos : 'top'
        };
    },


    'bottom-center' : function(cfg) {
        return {
            left: cfg.targetRect.left + cfg.targetRect.width/2 - cfg.contentSize.width/2 -hPadding,
            top: cfg.targetRect.height +  cfg.targetRect.top  + pinHeight + offset,
            offset: cfg.contentSize.width/2-pinWidth/2,
            pos : 'top'
        };
    },

    'bottom-right' : function(cfg) {
        return {
            left: cfg.targetRect.left + cfg.targetRect.width  - cfg.contentSize.width -hPadding*2 ,
            top: cfg.targetRect.height +  cfg.targetRect.top  + pinHeight + offset,
            offset: cfg.contentSize.width-pinOffset-pinHeight,
            pos : 'top'

        };
    },

    'right-top' : function(cfg) {
        console.log(cfg);
        return {
            left: cfg.targetRect.left - cfg.contentSize.width  -pinHeight - hPadding*2 - offset,
            top: cfg.targetRect.top ,
            offset: pinOffset,
            pos : 'right'
        };
    },

    'right-middle' : function(cfg) {
        console.log(cfg);
        return {
            left: cfg.targetRect.left - cfg.contentSize.width  -pinHeight - hPadding*2 - offset,
            top: cfg.targetRect.top + cfg.targetRect.height/2- cfg.contentSize.height/2 - vPadding/2,
            pos : 'right',
            offset: cfg.contentSize.width/2-pinWidth
        };
    },

    'right-bottom' : function(cfg) {
        console.log(cfg);
        return {
            left: cfg.targetRect.left - cfg.contentSize.width  -pinHeight - hPadding*2 - offset,
            top: cfg.targetRect.top + cfg.targetRect.height - cfg.contentSize.height - vPadding*2,
            offset: cfg.contentSize.height - pinOffset -pinWidth,
            pos : 'right'
        };
    },

    'left-top' : function(cfg) {
        console.log(cfg);
        return {
            left: cfg.targetRect.left +  cfg.targetRect.width + pinHeight + offset,
            top: cfg.targetRect.top,
            offset: pinOffset,
            pos : 'left'
        };
    },

    'left-middle' : function(cfg) {
        console.log(cfg);
        return {
            left: cfg.targetRect.left +  cfg.targetRect.width + pinHeight + offset,
            top: cfg.targetRect.top + cfg.targetRect.height/2 - cfg.contentSize.height/2 - vPadding,
            offset: cfg.contentSize.width/2-pinWidth,
            pos : 'left'
        };
    },

    'left-bottom' : function(cfg) {
        console.log(cfg);
        return {
            left: cfg.targetRect.left +  cfg.targetRect.width + pinHeight + offset,
            top: cfg.targetRect.top + cfg.targetRect.height - cfg.contentSize.height - vPadding*2,
            offset: cfg.contentSize.height - pinOffset -pinWidth,
            pos : 'left'
        };
    }
};



function createTooltip(cfg){
    var panel = FlowPanelManager.createPanel({
        target : target,
        render : cfg.render,
        pos : cfg.pos || 'top-center', // {top|middle|bottom}-{left|right|center}

        renderPanel : function(){
            var self = this;
            return <TooltipBox offset={self.position.offset} pos={self.position.pos}></TooltipBox>;
        },

        updatePanel : function(panel){
            panel.setState({
                offset : this.position.offset,
                pos : this.position.pos
            });
        },

        getPosition : function(cfg){ return calculators[this.pos].call(this, cfg);},

        __findBest : function(){
        }
    });
    return panel;
};

module.exports = {
    createTooltip : createTooltip
};