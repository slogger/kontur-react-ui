/* global SyntheticKeyboardEvent */
import events from 'add-event-listener';
import classNames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';

import Input from '../Input';
import listenFocusOutside from '../../lib/listenFocusOutside';

import '../ensureOldIEClassName';
import styles from './Select.less';

function renderValue(value, item) {
  return item;
}

function renderItem(value, item) {
  return item;
}

function isSelectable(value, item) {
  return true;
}

function filterItem(value, item, pattern) {
  return item.toLowerCase().indexOf(pattern) !== -1;
}

function normalizeEntry(entry) {
  if (Array.isArray(entry)) {
    return entry;
  } else {
    return [entry, entry];
  }
}

function getItemByValue(items, value) {
  for (let entry of items) {
    entry = normalizeEntry(entry);
    if (entry[0] === value) {
      return entry[1];
    }
  }
  return null;
}

type Props = {
  /**
   * Набор значений. Поддерживаются любые перечисляемые типы, в том числе
   * `Array`, `Map`, `Immutable.Map`.
   *
   * Элементы воспринимаются следующим образом: если элемент — это массив, то
   * первый элемент является значением , а второй — отображается в списке;
   * если элемент не является массивом, то он используется и для отображения,
   * и для значения.
   *
   * Для вставки разделителя можно использовать `Select.SEP`.
   */
  items : Array<any> | Map | Object;
  value? : any;
  defaultValue? : any;
  disabled? : boolean;

  /**
   * Показывать строку поиска в списке.
   */
  search? : boolean;
  placeholder? : React.Element;
  width? : number | string;

  /**
   * Визуально показать наличие ошибки.
   */
  error? : boolean;

  /**
   * Функция для отрисовки выбранного элемента. Аргументы — *value*, *item*.
   */
  renderValue? : (value: any, item?: any) => any;

  /**
   * Функция для отрисовки элемента в выпадающем списке. Аргументы — *value*,
   * *item*.
   */
  renderItem? : Function;

  filterItem? : Function;

  /**
   * DEPRECATED
   */
  isSelectable? : Function;
}

type State = {
  opened: boolean;
  current: number;
  value: any;
  searchPattern?: any;
}

type DefaultProps = {
  placeholder: string;
  renderItem : Function;
  renderValue : Function;
  filterItem : Function;
  isSelectable : Function;
}

class Select extends React.Component {

  props: Props;
  state: State;
  defaultProps: DefaultProps;

  static defaultProps = {
    placeholder: 'ничего не выбрано',
    renderValue,
    renderItem,
    filterItem,
    isSelectable,
  };

  static SEP = {};

  _menuContainer : HTMLElement;
  _focusSubscribtion : any;

  constructor(props : Props) {
    super(props);

    this.state = {
      opened: false,
      current: -1,
      value: props.defaultValue,
    };

    this._focusSubscribtion = null;
  }

  handleSearch : (event : Event) => void;
  handleSearch = (event) => {
    this.setState({searchPattern: event.target.value});
  };

  mapItems(fn : Function): Array<[any, any]> {
    const pattern = this.state.searchPattern &&
      this.state.searchPattern.toLowerCase();

    const ret = [];
    let index = 0;
    for (const entry of this.props.items) {
      const [value, item] = normalizeEntry(entry);
      if (!pattern || this.props.filterItem(value, item, pattern)) {
        ret.push(fn(value, item, index));
        ++index;
      }
    }

    return ret;
  }

  nextSelectable_(step : number) : number | void {
    const items = this.mapItems((value, item) => [value, item]);
    let current = this.state.current;
    do {
      current += step;
      if (current < 0) {
        current = items.length - 1;
      } else if (current >= items.length) {
        current = 0;
      }
      const [value, item] = items[current];
      if (item !== Select.SEP && this.props.isSelectable(value, item)) {
        return current;
      }
    } while (this.state.current !== current);
  }

  handleKey : (e : SyntheticKeyboardEvent) => void;
  handleKey = (e) => {
    var key = e.key;
    if (!this.state.opened) {
      if (key === ' ' || key === 'ArrowUp' || key === 'ArrowDown') {
        e.preventDefault();

        this.setState({opened: true});
      }
    } else {
      if (key === 'Escape') {
        this.setState({opened: false}, () => {
          ReactDOM.findDOMNode(this).focus();
        });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();

        const step = e.key === 'ArrowUp' ? -1 : 1;
        const current = this.nextSelectable_(step);
        this.setState({current});
      } else if (e.key === 'Enter') {
        const items = this.mapItems((value) => value);
        if (items[this.state.current]) {
          e.preventDefault(); // To prevent form submission.
          this.select_(items[this.state.current]);
        }
      }
    }
  };

  _handleItemClick(event : any, value : any) : void {
    if (event.button === 0) {
      this.select_(value);
    }
  }

  select_(value) {
    this.setState({
      opened: false,
      current: -1,
      value,
    }, () => {
      setTimeout(() => {
        ReactDOM.findDOMNode(this).focus();
      }, 0);
    });
    if (this.props.onChange) {
      this.props.onChange({target: {value}}, value);
    }
  }

  getValue_() : any {
    if (this.props.value !== undefined) {
      return this.props.value;
    }
    return this.state.value;
  }

  render() {
    var value = this.getValue_();

    var label;
    if (value !== null && value !== undefined) {
      label = this.props.renderValue(
        value,
        getItemByValue(this.props.items, value)
      );
    } else {
      label = (
        <span className={styles.placeholder}>{this.props.placeholder}</span>
      );
    }

    const focusable = !(this.state.opened && this.props.search) &&
      !this.props.disabled;

    var rootProps = {
      className: classNames({
        [styles.root]: true,
        [styles.isOpened]: this.state.opened,
        [styles.error]: this.props.error,
        [styles.disabled]: this.props.disabled,
      }),
      tabIndex: focusable ? '0' : '-1',
      onKeyDown: this.handleKey,
    };
    if (this.props.width) {
      rootProps.style = {
        width: this.props.width,
      };
    }

    var labelProps = {
      className: classNames({
        [styles.label]: true,
        [styles.labelIsOpened]: this.state.opened,
      }),
      onClick: this.open_,
    };

    return (
      <span {...rootProps}>
        <span {...labelProps}>
          <span className={styles.labelText}>{label}</span>
          <div className={styles.arrow} />
        </span>
        {!this.props.disabled && this.state.opened && this.renderMenu()}
      </span>
    );
  }

  renderMenu() {
    var search = null;
    if (this.props.search) {
      search = (
        <div className={styles.search}>
          <Input ref={(c) => c && ReactDOM.findDOMNode(c).focus()}
            onChange={this.handleSearch}
          />
        </div>
      );
    }

    var value = this.getValue_();

    return (
      <div ref={this._refMenuContainer} className={styles.container}>
        <div className={styles.drop}>
          <div className={styles.overlay} onMouseDown={this.close_} />
          <div style={{position: 'relative'}}>
            <div className={styles.menu}>
              {search}
              {this.mapItems((iValue, item, i) => {
                const itemClassName = classNames({
                  [styles.menuItem]: true,
                  [styles.menuItemSelected]: iValue === value,
                  [styles.menuItemCurrent]: i === this.state.current,
                });
                return item === Select.SEP
                  ? <div key={`hr:${i}`} className={styles.menuSep} />
                  : (
                    <div key={i} className={itemClassName}
                      onMouseDown={(e) => this._handleItemClick(e, iValue)}
                      onMouseEnter={(e) => this.setState({current: i})}
                      onMouseLeave={(e) => this.setState({current: -1})}
                    >
                        {this.props.renderItem(iValue, item)}
                    </div>
                  );
              })}
            </div>
          </div>
        </div>
        <div className={styles.botBorder} />
      </div>
    );
  }

  _refMenuContainer : (el : HTMLElement) => void;
  _refMenuContainer = (el) => {
    this._menuContainer = el;

    if (this._focusSubscribtion) {
      this._focusSubscribtion.remove();
      this._focusSubscribtion = null;

      events.removeEventListener(
        document, 'mousedown', this._handleNativeDocClick
      );
    }

    if (el) {
      this._focusSubscribtion = listenFocusOutside(
        [ReactDOM.findDOMNode(this)], this.close_
      );

      events.addEventListener(
        document, 'mousedown', this._handleNativeDocClick
      );
    }
  };

  open_ : () => void;
  open_ = () => {
    if (!this.state.opened) {
      this.setState({opened: true});
    }
  };

  close_ : () => void;
  close_ = () => {
    if (this.state.opened) {
      this.setState({
        opened: false,
        current: -1,
      });
    }
  };

  _handleNativeDocClick : (event : Event) => void
  _handleNativeDocClick = (event) => {
    const target = event.target || event.srcElement;
    if (this._menuContainer && !this._menuContainer.contains(target)) {
      this.close_();
    }
  };
}

export default Select;
