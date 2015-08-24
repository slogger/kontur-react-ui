var React = require('react');
var PropTypes = React.PropTypes;

var Input = require('../Input');

require('./Autocomplete.less');
var cx = require('../cx')('RTAutocomplete');

var AutocompleteMenu = React.createClass({

    getInitialState() {
     return {
       items : this.props && this.props.items || [],
       selectedIndex : 0
     }
    },

    render() {
        var items = this.state.items;
        var resizerStyles = {
            width: this.props.minWidth,
            height: 0
        };

        return (
            <div className={cx('menu')}
                 width={this.props.minWidth}
                >
                <div style={resizerStyles}></div>
                {items.map((item, i) => {
                    let rootClass = cx({
                        'menu-item': true,
                        "menu-item-selected": i == this.state.selectedIndex
                    });
                    return (
                        <div key={i}
                             className={rootClass}
                             onMouseEnter={e => this.setState({selectedIndex: i})}
                             onMouseDown={e => this._onItemClick(e, item)}>
                            {this.props.renderItem(item)}
                        </div>
                    );
                })}
            </div>
        );
    },

    selectPrev  : function(){
      var selectedIndex = --this.state.selectedIndex;
      if (selectedIndex<0)
        selectedIndex = 0;
      this.setState({selectedIndex : selectedIndex});
    },

    selectNext : function(){
      var selectedIndex = ++this.state.selectedIndex;
      if (selectedIndex>=this.state.items.length)
        selectedIndex=this.state.items.length-1;

      this.setState({selectedIndex : selectedIndex});
    },

    select : function(item) {
        if (this.props.onItemSelect)
            this.props.onItemSelect(item);
    },
    selectCurrent: function(){
        var item = this.state.items[this.state.selectedIndex];
        if (!item)
            return;
        this.select(item);
    },

    update : function(newState){
        var items = newState.items || this.state.items;
        var selectedIndex = newState.selectedIndex || this.state.selectedIndex;
        if (selectedIndex >= items.length)
            selectedIndex = 0;
        this.setState({
            items : items,
            selectedIndex : selectedIndex
        });
    },

    _onItemClick : function(e,item,i) {
        event.preventDefault();
        this.select(item);
    }
});


module.exports = AutocompleteMenu;
