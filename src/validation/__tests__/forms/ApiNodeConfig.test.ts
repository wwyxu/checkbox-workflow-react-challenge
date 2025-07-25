import { HttpTypes, NodeTypes } from '@/constants';
import { removeSelectedFieldsFromIsolatedApiNodes } from '@/utils';
import { validateURL } from '@/validation/common';
import { validateApiNodeConfig } from '../../forms/ApiNodeConfig';

describe('validateURL', () => {
  it('returns true for valid URLs', () => {
    expect(validateURL('https://example.com')).toBe(true);
    expect(validateURL('http://foo.bar')).toBe(true);
    expect(validateURL('ftp://ftp.example.com')).toBe(true);
  });

  it('returns false for invalid URLs', () => {
    expect(validateURL('not_a_url')).toBe(false);
    expect(validateURL('')).toBe(false);
    expect(validateURL('www.example.com')).toBe(false); // not a valid URL object
  });
});

describe('validateApiNodeConfig', () => {
  it('returns errors for missing fields', () => {
    const errors = validateApiNodeConfig('', '', '');
    expect(errors).toEqual({
      nodeName: 'Node name is required',
      httpMethod: 'Invalid HTTP Method',
      url: 'URL is required',
    });
  });

  it('returns error for invalid HTTP method', () => {
    const errors = validateApiNodeConfig('Name', 'GET', 'https://example.com');
    expect(errors.httpMethod).toBe('Invalid HTTP Method');
  });

  it('returns error for invalid URL', () => {
    const errors = validateApiNodeConfig('Name', HttpTypes.POST, 'not_a_url');
    expect(errors.url).toBe('Please enter a valid URL');
  });

  it('returns no error for valid input', () => {
    const errors = validateApiNodeConfig('Node', HttpTypes.POST, 'https://api.com');
    expect(errors).toEqual({});
  });

  it('trims whitespace in nodeName and url', () => {
    const errors = validateApiNodeConfig('   ', HttpTypes.POST, '   ');
    expect(errors.nodeName).toBe('Node name is required');
    expect(errors.url).toBe('URL is required');
  });
});

describe('removeSelectedFieldsFromIsolatedApiNodes', () => {
  const apiNode = {
    id: 'api1',
    type: NodeTypes.API,
    data: { label: 'API', selectedFields: ['foo', 'bar'] },
  };
  const formNode = {
    id: 'form1',
    type: NodeTypes.FORM,
    data: { label: 'Form', fields: [] },
  };

  it('removes selectedFields for isolated Api Nodes', () => {
    const nodes = [apiNode, formNode];
    const edges: any[] = [];
    const result = removeSelectedFieldsFromIsolatedApiNodes(nodes, edges);
    expect(result[0].data.selectedFields).toBeUndefined();
    expect(result[1].data.fields).toEqual([]);
  });

  it('does not remove selectedFields if Api Node has incoming edge', () => {
    const nodes = [apiNode, formNode];
    const edges = [{ source: 'form1', target: 'api1' }];
    const result = removeSelectedFieldsFromIsolatedApiNodes(nodes, edges);
    expect(result[0].data.selectedFields).toEqual(['foo', 'bar']);
  });

  it('returns [] if nodes or edges are not arrays', () => {
    expect(removeSelectedFieldsFromIsolatedApiNodes(null as any, [])).toEqual([]);
    expect(removeSelectedFieldsFromIsolatedApiNodes([], null as any)).toEqual([]);
  });

  it('does not affect non-Api Nodes', () => {
    const nodes = [formNode];
    const edges: any[] = [];
    const result = removeSelectedFieldsFromIsolatedApiNodes(nodes, edges);
    expect(result[0].data.fields).toEqual([]);
  });
});
