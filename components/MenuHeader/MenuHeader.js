// @flow

import React from 'react';

import styles from './MenuHeader.less';

type Props = {
  children: mixed,
};

/**
 * Заголовок в меню.
 */
export default class MenuHeader extends React.Component {
  props: Props;

  render() {
    return <div className={styles.root}>{this.props.children}</div>;
  }
}
