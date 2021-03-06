import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Checkbox from '../../components/Checkbox';
import { Header } from '../../components/Header';
import { BackIcon } from '../../components/icons/BackIcon';
import { ListIcon } from '../../components/icons/ListIcon';
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

export const HomeView: FunctionComponent = observer(() => {
  const store = useStore();

  const [selectedNodes, _setSelectedNodes] = useState<FigmaNode[]>([]);
  const selectedNodesRef = useRef(selectedNodes);
  const setSelectedNodes = (nodes) => {
    selectedNodesRef.current = nodes;
    _setSelectedNodes(nodes);
  };

  const [previousNodes, _setPreviousNodes] = useState<string[]>([]);
  const previousNodesRef = useRef(previousNodes);
  const setPreviousNodes = (node) => {
    previousNodesRef.current = node;
    _setPreviousNodes(node);
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
    }
    fme.ask('page-nodes').then(setNodes);

    fme.on('selection', () => {
      if (store.syncNodeIds.length > 0) {
        fme
          .ask('check if nodes exists', toJS(store.syncNodeIds))
          .then((ids: string[]) => store.setSyncNodeIds(ids));
      }
      fme.ask('page-nodes').then(setNodes);
    });

    return () => fme.removeListener('selection');
  }, []);

  const getImage = (node) => {
    const blob = new Blob([node.image.data], {
      type: node.image.mimetype,
    });

    return window.URL.createObjectURL(blob);
  };

  const getChildrenById = async (node: FigmaNode | string) => {
    const id = typeof node === 'string' ? node : node.id;

    const nodes = (await fme.ask('children by id', id)) as FigmaNode[];
    if (nodes.length > 0) {
      if (typeof node !== 'string') {
        console.log(node.parentId);
        setPreviousNodes([...previousNodesRef.current, node.parentId]);
      }
      setNodes(nodes);
    }
  };

  const clickBackButton = () => {
    if (previousNodes.length > 0) {
      const lastNodeId = previousNodes[previousNodes.length - 1];
      setPreviousNodes(
        previousNodesRef.current.filter((id) => lastNodeId !== id)
      );
      getChildrenById(lastNodeId);
    }
  };

  return (
    <Layout
      header={
        <Header
          title="Home"
          left={
            <BackIcon
              width={20}
              height={20}
              className={previousNodes.length > 0 ? '' : 'disabled'}
              onClick={clickBackButton}
            />
          }
          right={
            <Link to="/selected">
              <ListIcon width={20} height={20} />
            </Link>
          }
        />
      }
      footer={
        <Link to="/settings">
          <SettingsIcon width={20} height={20} />
        </Link>
      }
    >
      <Images>
        {selectedNodes.map((node) => (
          <div key={node.id}>
            <Image>
              {node.childrenCount > 0 && (
                <div className="children" onClick={() => getChildrenById(node)}>
                  View children
                </div>
              )}

              <img src={getImage(node)} />
              <div className="footer">
                <span>{node.name}</span>
                <Checkbox
                  checked={store.syncNodeIds.includes(node.id)}
                  onClick={() => store.toggleSyncNodeId(node.id)}
                />
              </div>
            </Image>
          </div>
        ))}
      </Images>
    </Layout>
  );
});

const Images = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  & > div {
    flex: 0 1 calc(50% - 10px);
    margin: 5px;
  }
`;

const Image = styled.div`
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
    width: 100%;
  }
  .footer {
    background-color: #fff;
    padding: 5px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      width: 97px;
    }
  }
`;
