import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

interface Props {
  left?: JSX.Element;
  title: string;
  right?: JSX.Element;
}

export const Header: FunctionComponent<Props> = observer((props: Props) => {
  return (
    <HeaderWrapper>
      <div>{props.left}</div>
      <div>{props.title}</div>
      <div>{props.right}</div>
    </HeaderWrapper>
  );
});

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  position: sticky;
  z-index: 3;
  top: 0;
  padding: 10px;
  border-bottom: 1px solid #dfdfdf;
  background-color: #fff;
  svg {
    &:not(.disabled) {
      cursor: pointer;
      &:hover {
        path {
          fill: #18a0fb;
        }
      }
    }
    &.disabled {
      opacity: 0.3;
    }
  }

  & > div {
    &:first-child {
      min-width: 30px;
      margin-right: auto;
      text-align: left;
    }
    &:nth-child(2) {
      text-align: center;
    }
    &:last-child {
      min-width: 30px;
      margin-left: auto;
      text-align: right;
    }
  }
`;
