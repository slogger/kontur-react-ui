import classNames from 'classnames';
import React, {PropTypes} from 'react';

import styles from './Radio.less';
import Icon from '../Icon';

/**
 * Индикатор для радио-кнопок. Используется в RadioGroup. Может быть
 * использована для кастомных радио-кнопок.
 */
class Radio extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,

    disabled: PropTypes.bool,

    focused: PropTypes.bool,

    error: PropTypes.bool,

    warning: PropTypes.bool,

    children: PropTypes.node,

    onChange: PropTypes.func,
  };

  static defaultProps = {
    checked: false,
    focused: false,
  };

  render() {
    const circleClasses = classNames({
      [styles.circle]: true,
      [styles.focused]: this.props.focused,
      [styles.error]: this.props.error,
      [styles.warning]: this.props.warning,
    });

    return (
      <label className={styles.root}>
        <input
          type="radio"
          className={styles.input}
          checked={this.props.checked}
          disabled={this.props.disabled}
          onChange={this.props.onChange}
        />
        <span className={circleClasses}>
          <div className={styles.inbox}><Icon name="circle-small" /></div>
        </span>
        {this.props.children}
      </label>
    );
  }
}

module.exports = Radio;
