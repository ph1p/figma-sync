import React from 'react';
import styled from 'styled-components';

const Checkbox = (props) => {
  return (
    <CheckboxWrapper {...props}>
      <div></div>
    </CheckboxWrapper>
  );
};

const CheckboxWrapper = styled.div`
  display: inline-block;
  position: relative;
  height: 13px;
  width: 13px;
  border-radius: 2px;
  border: 1px solid ${({ checked }) => (checked ? 'rgb(24, 160, 251)' : '#000')};
  overflow: hidden;
  div {
    cursor: pointer;
    opacity: ${({ checked }) => (checked ? 1 : 0)};
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgb(24, 160, 251);
    left: 0;
    top: 0;
    &:before {
      content: '';
      position: absolute;
      top: 1px;
      left: 3px;
      width: 3px;
      height: 5px;
      border-width: 0 2px 2px 0;
      border-color: #fff;
      border-style: solid;
      transform: rotate(45deg);
    }
  }
`;

export default Checkbox;
