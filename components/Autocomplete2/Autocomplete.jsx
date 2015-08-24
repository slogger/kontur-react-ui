var React = require('react');
var PropTypes = React.PropTypes;
var Input = require('../Input');
require('./Autocomplete.less');
var AutocompleteMenu = require('./AutocompleteMenu');
var FloatPanelManager = require('../FloatPanelManager');
var DomUtils = require('../FlowPanelManager/domUtils');
var cx = require('../cx')('RTAutocomplete');
var _ = require('underscore');

var Autocomplete = React.createClass({
  getInitialState : function(){      return {value : ""};  },

  render() {
    var inputProps = {
      value: this.state.value,
      onChange: e => this._handleChange(e),
      onFocus: e => this._handleFocus(e),
      onKeyDown: e => this._handleKey(e),
      onBlur: e => this._handleBlur(e)
    };
    return <Input {...this.props} {...inputProps} ref="input"/>;

  },

  componentWillUnmount(){
    if (this.menu) {
      this.menu.dispose();
      this.menu = null;
    }
  },

  _handleBlur(event) {
    this.__updateMenu({ menuIsVisible : false  });
    if (this.props.onBlur)
      this.props.onBlur(event);
  },

  _handleFocus(event) {
    this.__updateMenu({ menuIsVisible : true  });
    if (this.props.onFocus)
      this.props.onFocus(event);
  },

  _handleChange(e) {
    this._latestValue = e.target.value;
    var currentValue = this._latestValue;
    this.setState({value : currentValue});
    this.menuIsVisible = true;
    this._getItems(this._latestValue).then((items)=>{
      this._triggerOnChange(currentValue, items);
      if (!this.menuIsVisible || currentValue!=this._latestValue)
        return;
      if (!this.menu)
        this.menu = this._createMenu();
      this.menu.show();
      this.menu.content.update({ items : items});
    });
  },

  _onItemSelect : function(item){
    var value = this._getDisplayText(item);
    this.setState({value : value});
    this.__updateMenu({ menuIsVisible : false  });
    if (this.props.onChange)
      this.props.onChange(value, item);
  },

  _handleKey(event) {
    var items = this.state.items;
    var stop = false;
    if (this.menu){
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Enter' || event.key==='Escape') {
          event.preventDefault();
          stop = true;
          if (event.key === 'ArrowUp') {
             this.menu.content.selectPrev();
          }
          else if (event.key === 'ArrowDown') {
            this.menu.content.selectNext();
          }
          else if (event.key === 'Escape') {
            this.__updateMenu({ menuIsVisible : false  });
          }
          else if (event.key === 'Enter') {
            this.menu.content.selectCurrent();
          }
        }
    }
  },

  _getDisplayText : function(item){
      if (this.props.getDisplayText)
        return this.props.getDisplayText.call(this, item);

      if (this.props.displayField)
          return item[this.props.displayField];
  },

  _renderItem : function(item){
    if (this.props.renderItem)
      return this.props.renderItem.apply(this, arguments);
    return this._getDisplayText(item);
  },

  _getItems : function(query){
    if (typeof(this.props.source)=="function")
       return this.props.source.call(this, query);
    else
      throw "autocomplete source is invalid";
  },

  __updateMenu : function(cfg) {
    if (cfg.menuIsVisible!==undefined)
      this.menuIsVisible = cfg.menuIsVisible;
    if (!this.menuIsVisible) {
      if (this.menu)
        this.menu.hide();
      return;
    }

    var currentValue = this.state.value;
    this._getItems(this.state.value).then((items)=>{
        if (!this.menuIsVisible || currentValue!=this.state.value)
          return;
        if (!this.menu)
          this.menu = this._createMenu();
        this.menu.show();
        this.menu.content.update({ items : items});
      });
  },

  _createMenu : function(){
    var input = this.refs.input.refs.input.getDOMNode();
    var displayField = this.props.displayField;
    var width = DomUtils.outerWidth(input);
    var onItemSelect = this._onItemSelect;
    var renderItem = this._renderItem;

    return FloatPanelManager.createPanel({
      render: function () { return <AutocompleteMenu items={[]} minWidth={width} renderItem={renderItem} onItemSelect={onItemSelect}/>},
      target: ()=>this.refs.input.refs.input.getDOMNode(),
      getPosition : function(cfg){
        return {
          left: cfg.targetRect.left,
          top : cfg.targetRect.top + cfg.targetRect.height + 2
        };
      }
    });
  },

  _triggerOnChange : function(currentValue, items){
     if (!this.props.onChange)
        return;
    var foundItem = _.find(items, (x)=>this._getDisplayText(x)==currentValue);
    this.props.onChange(currentValue, foundItem);
  }
});

module.exports = Autocomplete;
