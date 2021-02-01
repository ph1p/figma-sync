import React from 'react';
import styled from 'styled-components';

const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <ButtonStyled {...props}>{props.children}</ButtonStyled>;
};

const ButtonStyled = styled.button`
  color: #fff;
  border: 0;
  background-clip: border-box;
  font-weight: bold;
  font-size: 11px;
  display: block;
  padding: 10px 12px;
  background-color: transparent;
  box-sizing: border-box;
  border-radius: 6px;
  background-color: #18a0fb;
  height: 32px;
  cursor: pointer;
`;

export default Button;
