import { makeAutoObservable } from 'mobx';
import React from 'react';
import { AsyncTrunk } from 'mobx-sync';
import fme from '../utils/FigmaMessageEmitter';

const STORAGE_KEY = '__figma_mobx_sync__';

class RootStore {
  constructor() {
    makeAutoObservable(this);
  }

  token = '';
  url = '';
  syncNodeIds = [];
  serverFolders: Record<string, string[]> = null;

  /**
   * Toggle ids which should be synchonized
   * @param id
   */
  toggleSyncNodeId(id: string) {
    if (this.syncNodeIds.includes(id)) {
      this.syncNodeIds = this.syncNodeIds.filter((syncId) => syncId !== id);
    } else {
      this.syncNodeIds = [...this.syncNodeIds, id];
    }
  }

  /**
   * Set Server URL
   * @param url
   */
  setUrl(url: string) {
    this.url = url;
  }

  /**
   * Set API-Token
   * @param token
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * Set folders from server
   * @param folders
   */
  setServerFolders(folders: Record<string, string[]>) {
    this.serverFolders = folders;
  }

  // Log user out
  logout() {
    this.setToken('');
    this.setServerFolders(null);
  }
}

const rootStore = new RootStore();

export type TStore = RootStore;

const StoreContext = React.createContext<TStore | null>(null);

export const StoreProvider = ({ children }) => {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
};

export const trunk = new AsyncTrunk(rootStore, {
  storageKey: STORAGE_KEY,
  storage: {
    getItem(key: string) {
      fme.send('storage get item', key);
      return new Promise((resolve) => fme.once('storage get item', resolve));
    },
    setItem(key: string, value: string) {
      fme.send('storage set item', {
        key,
        value,
      });
      return new Promise((resolve) => fme.once('storage set item', resolve));
    },
    removeItem(key: string) {
      fme.send('storage remove item', key);
      return new Promise((resolve) => fme.once('storage remove item', resolve));
    },
  },
});

export const getStoreFromMain = (): Promise<TStore | {}> => {
  return new Promise((resolve) => {
    fme.send('storage', STORAGE_KEY);
    fme.once('storage', (store, send) => {
      send('store initialized');
      resolve(JSON.parse(store || '{}'));
    });
  });
};
