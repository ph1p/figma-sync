import { observer } from 'mobx-react';
import React, { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/Button';
import { useStore } from '../../store';
import { fetchFolders } from '../../utils/queries';
import { sleep } from '../../utils/helpers';
import { Header } from '../../components/Header';
import { Layout } from '../../components/Layout';
import { BackIcon } from '../../components/icons/BackIcon';
import { SyncIcon } from '../../components/icons/SyncIcon';

export const SettingsView: FunctionComponent = observer(() => {
  const store = useStore();

  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const [loading, isError, data] = useGetFolders(store.url, store.token);

  // useEffect(() => {
  //   if (!loading && !isError && data) {
  //     store.setToken(token);
  //     store.setServerFolders(data);
  //   }
  // }, [loading, isError, data]);

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
    <Layout
      header={
        <Header
          title="Settings"
          left={
            <Link to="/">
              <BackIcon width={20} height={20} />
            </Link>
          }
          right={
            store.isLoggedIn && (
              <SyncIconWrap
                spin={isLoading ? 1 : 0}
                width={20}
                height={20}
                onClick={() => getFolders(store.url, store.token)}
              />
            )
          }
        />
      }
    >
      {store.isLoggedIn ? (
        <>
          connected with: {store.url}
          <br />
          <strong>Folders:</strong>{' '}
          {Object.keys(store.serverFolders).join(', ')}
          <Button onClick={() => store.logout()}>abmelden</Button>
          {isLoading && 'syncing...'}
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
    </Layout>
  );
});

const SyncIconWrap = styled<{ spin: boolean }>(SyncIcon)`
  ${(props) => (props.spin ? 'animation: rotate 2s linear infinite;' : '')}

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`;
