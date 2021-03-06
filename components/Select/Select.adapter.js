/* @flow */

import Select from './Select.js';

const SelectAdapter = {
  getValue(inst) {
    return inst._getValue();
  },

  setValue(inst, value) {
    if (inst.props.onChange) {
      inst.props.onChange({target: {value}}, value);
    }
  },

  getItemValues(inst) {
    inst._open();
    inst._close();
    return inst.mapItems((value) => value);
  },
};

Select.__ADAPTER__ = SelectAdapter;

export default Select;
