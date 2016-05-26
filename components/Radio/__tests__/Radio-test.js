import Radio from '../Radio';
import React from 'react';
import {shallow} from 'enzyme';

describe('Radio', () => {
  it('properly calls onChange prop', () => {
    let checked = false;
    const onChange = (e) => {checked = e.target.checked;};
    const wrapper = shallow(<Radio onChange={onChange}/>);
    wrapper.find('input').simulate('change', {target: {checked: true}});
    expect(checked).toBe(true);
  });

  /* // Not working - needs component to be mounted
  it('do not calls onChange prop if disabled', () => {
    let checked = false;
    const onChange = (e) => {checked = e.target.checked;};
    const wrapper = shallow(<Radio disabled onChange={onChange}/>);
    wrapper.find('input').simulate('change', { target: { checked: true } });
    expect(checked).toBe(false);
  });
  */

  it('contains children in output', () => {
    const child = 'SomeTextHere';
    const wrapper = shallow(<Radio>{child}</Radio>);
    expect(wrapper.contains(child)).toBe(true);
  });

  it('properly handles checked prop', () => {
    const wrapper = shallow(<Radio checked />);
    expect(wrapper.find('input').node.props.checked).toBeTruthy();

    wrapper.setProps({checked: false});
    expect(wrapper.find('input').node.props.checked).toBeFalsy();
  });

  it('properly handles disabled prop', () => {
    const wrapper = shallow(<Radio disabled />);
    expect(wrapper.find('input').node.props.disabled).toBeTruthy();

    wrapper.setProps({disabled: false});
    expect(wrapper.find('input').node.props.disabled).toBeFalsy();
  });
});
