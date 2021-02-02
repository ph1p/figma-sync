import { observer } from 'mobx-react';
import React, { FunctionComponent, PropsWithChildren } from 'react';

import styled from 'styled-components';

interface Props {
  header: JSX.Element;
  footer?: JSX.Element;
}

export const Layout: FunctionComponent<PropsWithChildren<Props>> = observer(
  (props: PropsWithChildren<Props>) => {
    return (
      <View hasFooter={!!props.footer}>
        <Content>
          {props.header}

          {props.children}
        </Content>
        {props.footer && <Footer>{props.footer}</Footer>}
      </View>
    );
  }
);

const Footer = styled.footer`
  overflow: auto;
  display: flex;
  justify-content: space-between;
  height: 41px;
  border-top: 1px solid #dfdfdf;
  padding: 10px;
  align-items: center;
  svg {
    cursor: pointer;
    &:hover {
      path {
        fill: #18a0fb;
      }
    }
  }
`;

const View = styled.div`
  display: grid;
  overflow: auto;
  grid-template-rows: ${(props) =>
    props.hasFooter ? 'calc(100vh - 41px) 41px' : '100vh'};
`;

const Content = styled.div`
  position: relative;
  overflow: auto;
  background: repeating-linear-gradient(#fff, #fff 50px),
    repeating-linear-gradient(270deg, #ddd 50px);
`;
