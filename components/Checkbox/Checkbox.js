// @flow
import classNames from 'classnames';
import events from 'add-event-listener';
import React, {PropTypes} from 'react';

import Icon from '../Icon';

import '../ensureOldIEClassName';
import styles from './Checkbox.less';

type CheckboxEvent = SyntheticEvent & {target: HTMLInputElement}

type IProps = {
  checked: boolean,
  disabled?: boolean,
  error?: boolean,
  warning?: boolean,
  onChange?: (e: CheckboxEvent) => any,
  children?: any,
}

type IState = {
  checked: boolean,
  active: boolean,
  focused: boolean,
}

class Checkbox extends React.Component {
  static __ADAPTER__: any;

  static propTypes = {
    checked: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    warning: PropTypes.bool,
    onChange: PropTypes.func,
  };

  props: IProps;

  state: IState;

  constructor(props: IProps, context: any) {
    super(props, context);

    this.state = {
      checked: props.checked !== undefined ? props.checked : false,
      active: false,
      focused: false,
    };
  }

  render() {
    var rootClass = classNames({
      [styles.root]: true,
      [styles.isChecked]: this.state.checked,
      [styles.isActive]: this.state.active,
      [styles.isFocused]: this.state.focused,
      [styles.isDisabled]: this.props.disabled,
      [styles.error]: this.props.error,
      [styles.warning]: this.props.warning,
    });

    return (
      <label className={rootClass} onMouseDown={this.handleActivate}>
        <input type="checkbox" className={styles.input}
          checked={this.state.checked}
          disabled={this.props.disabled}
          onChange={this.handleChange} onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        <span className={styles.box}>
          <div className={styles.ok}><Icon name="ok" /></div>
        </span>
        <span className={styles.caption}>{this.props.children}</span>
      </label>
    );
  }

  componentWillReceiveProps(props: IProps) {
    if (props.checked !== undefined) {
      this.setState({checked: props.checked});
    }
  }

  handleActivate = (event: SyntheticMouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    this.setState({active: true});

    events.addEventListener(document, 'mouseup', this.deactivate);
  };

  deactivate = () => {
    this.setState({active: false});

    events.removeEventListener(document, 'mouseup', this.deactivate);
  };

  handleChange = (event: CheckboxEvent) => {
    if (this.props.checked === undefined) {
      this.setState({checked: event.target.checked});
    }

    this.props.onChange && this.props.onChange(event, event.target.checked);
  };

  handleFocus = () => {
    this.setState({focused: true});
  };

  handleBlur = () => {
    this.setState({focused: false});
  };
}

export default Checkbox;
