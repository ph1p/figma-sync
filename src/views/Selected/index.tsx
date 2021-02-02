import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Checkbox from '../../components/Checkbox';
import { Header } from '../../components/Header';
import { BackIcon } from '../../components/icons/BackIcon';
import { CloudUploadIcon } from '../../components/icons/CloudUploadIcon';
import { SettingsIcon } from '../../components/icons/SettingsIcon';
import { Layout } from '../../components/Layout';
import { useStore } from '../../store';
import fme from '../../utils/FigmaMessageEmitter';
// import axios from 'axios';
interface FigmaNodeImage {
  data: Uint8Array;
  mimetype: string;
}

interface FigmaNode {
  id: string;
  name: string;
  width: number;
  height: number;
  type: 'JPG' | 'PNG' | 'SVG' | 'PDF';
  parentId: string;
  image: FigmaNodeImage;
  childrenCount: number;
}

export const SelectedView: FunctionComponent = observer(() => {
  const store = useStore();

  const [selectedNodes, _setSelectedNodes] = useState<FigmaNode[]>([]);
  const selectedNodesRef = useRef(selectedNodes);
  const setSelectedNodes = (nodes) => {
    selectedNodesRef.current = nodes;
    _setSelectedNodes(nodes);
  };

  const setNodes = async (selections: FigmaNode[]) => {
    setSelectedNodes([]);
    for (const selection of selections) {
      const image = (await fme.ask('image by id', {
        id: selection.id,
        format: 'SVG',
      })) as FigmaNodeImage;

      if (image) {
        setSelectedNodes([
          ...selectedNodesRef.current,
          {
            ...selection,
            image,
          },
        ]);
      }
    }
  };

  useEffect(() => {
    // check if all selected nodes exists
    if (store.syncNodeIds.length > 0) {
      fme
        .ask('check if nodes exists', toJS(store.syncNodeIds))
        .then((ids: string[]) => store.setSyncNodeIds(ids));

      fme.ask('nodes by ids', toJS(store.syncNodeIds)).then((nodes) => {
        setNodes(nodes as FigmaNode[]);
      });
    }
  }, []);

  const getImage = (node) => {
    const blob = new Blob([node.image.data], {
      type: node.image.mimetype,
    });

    return window.URL.createObjectURL(blob);
  };

  return (
    <Layout
      header={
        <Header
          title="Selected Nodes"
          left={
            <Link to="/">
              <BackIcon width={20} height={20} />
            </Link>
          }
          right={
            <div onClick={() => {}}>
              <CloudUploadIcon width={20} height={20} />
            </div>
          }
        />
      }
      footer={
        <Link to="/settings">
          <SettingsIcon width={20} height={20} />
        </Link>
      }
    >
      <List>
        {selectedNodes.map((node) => (
          <Item key={node.id}>
            <div>
              <div>
                <img src={getImage(node)} />
              </div>
              <div>
                <span>{node.name}</span>
              </div>
              <div>
                <Checkbox
                  checked={store.syncNodeIds.includes(node.id)}
                  onClick={() => store.toggleSyncNodeId(node.id)}
                />
              </div>
            </div>
            <div>
              {store.serverFolders && (
                <select name="" id="">
                  {Object.entries(store.serverFolders).map(
                    ([folder, files]) => (
                      <optgroup key={folder} label={folder}>
                        {files.map((file) => (
                          <option key={folder + file} value={file}>
                            {file}
                          </option>
                        ))}
                      </optgroup>
                    )
                  )}
                </select>
              )}
            </div>
          </Item>
        ))}
      </List>
    </Layout>
  );
});

const List = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  & > div {
    flex: 0 1 calc(50% - 10px);
    margin: 5px;
  }
`;

const Item = styled.div`
  position: relative;
  background-color: #fff;
  background-image: repeating-linear-gradient(
      45deg,
      #ddd 25%,
      transparent 25%,
      transparent 75%,
      #ddd 75%,
      #ddd
    ),
    repeating-linear-gradient(
      45deg,
      #ddd 25%,
      #fff 25%,
      #fff 75%,
      #ddd 75%,
      #ddd
    );
  background-position: 0 0, 5px 5px;
  background-size: 10px 10px;
  border: 1px solid #ddd;
  .children {
    position: absolute;
    top: 8px;
    left: 8px;
    background-color: #18a0fb;
    border-radius: 4px;
    padding: 4px 7px;
    color: #fff;
    font-size: 11px;
    cursor: pointer;
    &:hover {
    }
  }
  img {
    width: 50px;
  }
`;
