const React = require('react');

const PropTypes = React.PropTypes;

import styles from './Box.less';

var TooltipBox = React.createClass({
  pos : 'top',

  getInitialState : function(){
     return {
        offset : this.props.offset || 10,
        pos : this.props.pos || 'top'
     }
  },

  render() {
    var pinSize = 10;
    var offset = this.state.offset;

    var box = {
      position : 'relative'
    };
    var pin = {
      position : 'absolute',
      border:  pinSize + 'px solid #ccc;',
    };
    var pinInner = {
      position : 'absolute',
      border: pinSize + 'px solid #fff',
    };

    var settingsList = {
      left : { hiddenBorders : [0,2,3], position:["+offset",null,null,-1], zeroBorder: "borderLeft"},
      top : { hiddenBorders : [0,1,3], position:[-1,null,null,"+offset"], zeroBorder: "borderTop"},
      right : { hiddenBorders : [0,1,2], position:["+offset",-1,null,null], zeroBorder: "borderRight"},
      bottom : { hiddenBorders : [1,2,3], position:[null,null,-1,"+offset"], zeroBorder: "borderBottom"}
    };

    var pinSettings = settingsList[this.state.pos];

    var borderNames = ['borderTopColor','borderRightColor','borderBottomColor','borderLeftColor'];
    var positions = ['top','right','bottom','left'];

    for (var i = 0; i < borderNames.length; i++) {
      var border = borderNames[i];
      pin[border] = '#ccc';
      pinInner[border] = '#fff';
    }

    for (var i = 0; i < pinSettings.hiddenBorders.length; i++) {
      var border = borderNames[pinSettings.hiddenBorders[i]];
      pin[border] = 'transparent';
      pinInner[border] = 'transparent';
    }

    for (var i = 0; i < positions.length; i++) {
      var p = pinSettings.position[i];
        if (p===null)
        continue;

      if (p=="+offset")
        p = offset;
      else if (p=="-offset")
        p = -offset;
      else {
        p = p * 2 * pinSize;
      }

      var pinVal = p;
      var pinInnerVal = p;
      if (pinSettings.position[i] == 1) {
        pinVal -= 1;
        pinInnerVal -= 2;
      }
      else if (pinSettings.position[i] == -1) {
        pinVal += 1;
        pinInnerVal += 2;
      }

      var pos = positions[i];
      pin[pos] = pinVal;
      pinInner[pos] = pinInnerVal;
    }
    //pin[pinSettings.zeroBorder] = 0;
    //pinInner[pinSettings.zeroBorder] = 0;
    return (
        <div style={box}>
          <div className={styles.inner}>
            <div style={pin} ></div>
            <div style={pinInner}  ></div>
            <div ref='childrenContainer'>
              {this.props.children}
            </div>
          </div>
        </div>);
  }
});

module.exports = TooltipBox;
