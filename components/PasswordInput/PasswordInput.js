import React from 'react';
import Input from 'retail-ui/components/Input';
import Icon from 'retail-ui/components/Icon';

import styles from './PasswordInput.less';

class PasswordInput extends React.Component {
  static defaultProps = {
    width: 305,
  };

  state = {
    isPasswordVisible: false,
  };

  showPassword = () => this.setState({isPasswordVisible: true});

  hidePassword = () => this.setState({isPasswordVisible: false});

  render() {
    const isPasswordVisible = this.state.isPasswordVisible;
    return (
      <div className={styles.passwordWrapper} >
        <span
          className={styles.showPass}
          onMouseDown={this.showPassword}
          onMouseUp={this.hidePassword}
          onMouseLeave={this.hidePassword}
        >
          <Icon name={isPasswordVisible ? 'eye' : 'eye-slash'} size="14" />
        </span>
        <span style={isPasswordVisible ? {display: 'none'} : null}>
          <Input
            {...this.props}
            type="password"
            width={this.props.width}
          />
        </span>
        <span style={!isPasswordVisible ? {display: 'none'} : null}>
          <Input {...this.props} width={this.props.width} />
        </span>
      </div>
    );
  }
}

export default PasswordInput;
