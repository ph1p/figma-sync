import { observer } from 'mobx-react';
import React, { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import { useStore } from '../../store';
import { fetchFolders } from '../../utils/fetchQueries';
import { sleep } from '../../utils/helpers';

export const SettingsView: FunctionComponent = observer(() => {
  const store = useStore();

  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const connect = (e) => {
    e.preventDefault();
    getFolders(store.url, token);
  };

  const getFolders = async (url, token) => {
    setIsLoading(true);
    try {
      const data = await fetchFolders(url, token);
      // just for GUI
      await sleep(500);
      store.setToken(token);
      store.setServerFolders(data);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  return (
    <View>
      Settings<Link to="/">Home</Link>
      {store.token ? (
        <>
          <Button onClick={() => store.logout()}>abmelden</Button>

          {isLoading && 'syncing...'}
          <Button onClick={() => getFolders(store.url, store.token)}>
            resync
          </Button>
        </>
      ) : !isLoading ? (
        <form onSubmit={connect}>
          <div>
            <input
              type="text"
              name="url"
              value={store.url}
              onChange={(e) => store.setUrl(e.currentTarget.value)}
            />
          </div>
          <div>
            <input
              type="text"
              name="token"
              value={token}
              onChange={(e) => setToken(e.currentTarget.value)}
            />
          </div>
          <Button type="submit">Connect to Server</Button>
        </form>
      ) : (
        'loading...'
      )}
      {JSON.stringify(store.serverFolders)}
    </View>
  );
});

const View = styled.div``;
