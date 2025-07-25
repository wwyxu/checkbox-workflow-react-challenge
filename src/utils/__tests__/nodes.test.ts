import { getImmediatePrecedingFormNodes, createNewNode } from '../nodes';
import { NodeTypes, HttpTypes } from '@/constants';

describe('createNewNode', () => {
  it('creates a Form Node', () => {
    const node = createNewNode(1, NodeTypes.FORM, { x: 10, y: 20 });
    expect(node).toEqual({
      id: '1',
      type: NodeTypes.FORM,
      position: { x: 10, y: 20 },
      data: {
        label: `Form Node`,
        fields: [],
      },
    });
  });

  it('creates a Conditional Node', () => {
    const node = createNewNode(2, NodeTypes.CONDITIONAL, { x: 0, y: 0 });
    expect(node).toEqual({
      id: '2',
      type: NodeTypes.CONDITIONAL,
      position: { x: 0, y: 0 },
      data: {
        label: `Conditional Node`,
        conditions: [],
      },
    });
  });

  it('creates an Api Node', () => {
    const node = createNewNode(3, NodeTypes.API, { x: 5, y: 5 });
    expect(node).toEqual({
      id: '3',
      type: NodeTypes.API,
      position: { x: 5, y: 5 },
      data: {
        label: `Api Node`,
        endpoint: '',
        method: HttpTypes.POST,
        selectedFields: [],
      },
    });
  });
});

describe('getImmediatePrecedingFormNodes', () => {
  const formFieldA = { name: 'A', type: 'text' };
  const formFieldB = { name: 'B', type: 'number' };

  const nodes = [
    { id: 'form1', type: 'form', data: { label: 'Form 1', fields: [formFieldA] } },
    { id: 'form2', type: 'form', data: { label: 'Form 2', fields: [formFieldB] } },
    { id: 'api1', type: 'api', data: { label: 'Api Node' } },
  ];

  const edges = [
    { source: 'form1', target: 'api1' },
    { source: 'form2', target: 'api1' },
  ];

  it('returns fields from all immediate Form predecessors', () => {
    const result = getImmediatePrecedingFormNodes('api1', nodes, edges);
    expect(result).toEqual([
      { name: 'A', type: 'text', nodeName: 'Form 1', nodeId: 'form1' },
      { name: 'B', type: 'number', nodeName: 'Form 2', nodeId: 'form2' },
    ]);
  });

  it('returns empty array if no predecessors', () => {
    expect(getImmediatePrecedingFormNodes('form1', nodes, edges)).toEqual([]);
  });

  it('returns empty array if node does not exist', () => {
    expect(getImmediatePrecedingFormNodes('notfound', nodes, edges)).toEqual([]);
  });

  it('ignores non-form predecessors', () => {
    const edges2 = [{ source: 'api1', target: 'form1' }];
    expect(getImmediatePrecedingFormNodes('form1', nodes, edges2)).toEqual([]);
  });

  it('handles Form Nodes with empty fields', () => {
    const nodes2 = [
      { id: 'form3', type: 'form', data: { label: 'Form 3', fields: [] } },
      { id: 'api2', type: 'api', data: { label: 'Api Node' } },
    ];
    const edges2 = [{ source: 'form3', target: 'api2' }];
    expect(getImmediatePrecedingFormNodes('api2', nodes2, edges2)).toEqual([]);
  });
});
