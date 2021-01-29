// store
import { observer } from 'mobx-react';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useStore } from '../../store';

export const SettingsView: FunctionComponent = observer(() => {
  const store = useStore();

  return (
    <View>
      Settings<Link to="/">Home</Link>
      <input
        type="text"
        name="url"
        value={store.url}
        onChange={(e) => store.setUrl(e.currentTarget.value)}
      />
    </View>
  );
});

const View = styled.div``;
