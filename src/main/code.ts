import fme from '../utils/FigmaMessageEmitter';
import './store';

figma.showUI(__html__, {
  width: 300,
  height: 450,
});

const getMimeType = (format) => {
  return {
    SVG: 'image/svg+xml',
    PNG: 'image/png',
    JPG: 'image/jpeg',
  }[format];
};

const transformNode = (node) => ({
  id: node.id,
  name: node.name,
  width: node.width,
  height: node.height,
  type: node.type,
  parentId: node.parent.id,
  childrenCount: node.children?.length || 0,
});

const getNodes = (nodes) => (nodes || []).map(transformNode);

fme.answer('check if nodes exists', (ids: string[]) =>
  ids.filter(figma.getNodeById)
);

fme.answer('nodes by ids', (ids: string | string[]) => {
  if (typeof ids === 'string') {
    return transformNode(figma.getNodeById(ids));
  } else {
    return ids
      .filter(figma.getNodeById)
      .map((node) => transformNode(figma.getNodeById(node)));
  }
});

fme.answer('children by id', (id) =>
  getNodes((figma.getNodeById(id) as any).children)
);
fme.answer('page-nodes', getNodes(figma.currentPage.children));
fme.answer('current-selection', getNodes(figma.currentPage.selection));

fme.answer('image by id', async ({ id, format }) => {
  try {
    const node = figma.getNodeById(id) as SceneNode;

    const options: any = {
      format: format || 'SVG',
    };
    if (options.format === 'PNG' || options.format === 'JPG') {
      options.constraint = {
        type: 'SCALE',
        value: 1,
      };
    }

    return {
      data: await node.exportAsync(options),
      mimetype: getMimeType(format),
    };
  } catch (e) {
    return null;
  }
});

// figma.on('currentpagechange', () => {
//   fme.send('page', figma.currentPage);
// });

figma.on('selectionchange', async () => {
  fme.send('selection', getNodes(figma.currentPage.selection));
});
