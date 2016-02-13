import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import Spinner from '../Spinner';
import styles from './Loader.less';

/**
 * DRAFT - лоадер-контейнер
 */
class Loader extends React.Component {
  _spinnerContainer;

  componentDidMount() {
    this._adjustSpinnerPosition();
  }

  componentDidUpdate() {
    this._adjustSpinnerPosition();
  }

  _adjustSpinnerPosition() {
    const {maxTopOffset, active} = this.props;

    if (!active) {
      return;
    }

    if (maxTopOffset != null) {
      const loader = ReactDOM.findDOMNode(this);
      const loaderHeight = loader.offsetHeight;

      const spinner = this._spinnerContainer.firstChild;
      const spinnerHeight = spinner.offsetHeight;

      if (loaderHeight/2 - spinnerHeight/2 > maxTopOffset) {
        this._spinnerContainer.style.top = `${maxTopOffset}px`;
        this._spinnerContainer.style.bottom = 'auto';

        return;
      }
    }

    this._spinnerContainer.style.top = null;
    this._spinnerContainer.style.bottom = null;
  }

  _renderSpinner = (type, caption) => (
      <span className={styles.spinnerContainerCenter}
        ref={(ref) => this._spinnerContainer = ref}
      >
        <Spinner type={type} caption={caption} />
      </span>
  );

  render() {
    const {active, type, caption, className} = this.props;

    const loaderClassName = classnames(className, styles.loader, {
      [styles.active]: active,
    });

    return (
      <div className={loaderClassName}>
        {this.props.children}

        {active && this._renderSpinner(type, caption)}
      </div>
    );
  }
}

Loader.propTypes = {
  /**
   * показываем лоадер или нет
   */
  active: PropTypes.bool.isRequired,

  /**
   * Текст рядом с лоадером.
   *
   * "Загрузка" - значение по-умолчанию
   */
  caption: PropTypes.string,

  /**
   * Тип спиннера: mini, normal, big
   *
   * Значение по-умолчанию - normal
   *
   * Spinner.types - все доступные типы
   */
  type: PropTypes.oneOf(Object.keys(Spinner.Types)),

  /**
   * Максимальный отступ сверху
   *
   * Если значение не задано, то лоадер помещаем в центр
   */
  maxTopOffset: PropTypes.number,
};

Loader.defaultProps = {
  type: Spinner.Types.normal,
};

export default Loader;
