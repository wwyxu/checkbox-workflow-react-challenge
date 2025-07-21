import { validateWorkflowPath } from '../workflow/ValidPath';

describe('validateWorkflowPath', () => {
  it('returns error if no start node exists', () => {
    const nodes = [{ id: '1', type: 'end' }];
    const edges = [];
    const errors = validateWorkflowPath(nodes, edges);
    expect(errors).toContain('No start node found');
  });

  it('returns error if no end node exists', () => {
    const nodes = [{ id: '1', type: 'start' }];
    const edges = [];
    const errors = validateWorkflowPath(nodes, edges);
    expect(errors).toContain('No end node found');
  });

  it('returns both errors if both start and end nodes are missing', () => {
    const nodes = [{ id: '1', type: 'process' }];
    const edges = [];
    const errors = validateWorkflowPath(nodes, edges);
    expect(errors).toContain('No start node found');
    expect(errors).toContain('No end node found');
  });

  it('returns error if no path from start to end exists', () => {
    const nodes = [
      { id: 'start', type: 'start' },
      { id: 'middle', type: 'process' },
      { id: 'end', type: 'end' }
    ];
    const edges = [
      { source: 'start', target: 'middle' }
      // No edge from middle to end
    ];
    const errors = validateWorkflowPath(nodes, edges);
    expect(errors).toContain('No complete path exists from start node start to end node end');
  });

  it('returns empty array if valid path exists from start to end', () => {
    const nodes = [
      { id: 'start', type: 'start' },
      { id: 'middle', type: 'process' },
      { id: 'end', type: 'end' }
    ];
    const edges = [
      { source: 'start', target: 'middle' },
      { source: 'middle', target: 'end' }
    ];
    const errors = validateWorkflowPath(nodes, edges);
    expect(errors).toEqual([]);
  });

  it('handles cycles without infinite loop', () => {
    const nodes = [
      { id: 'start', type: 'start' },
      { id: 'loop', type: 'process' },
      { id: 'end', type: 'end' }
    ];
    const edges = [
      { source: 'start', target: 'loop' },
      { source: 'loop', target: 'start' }, // cycle
      { source: 'loop', target: 'end' }
    ];
    const errors = validateWorkflowPath(nodes, edges);
    expect(errors).toEqual([]);
  });

  it('returns error if start and end are not connected despite cycles', () => {
    const nodes = [
      { id: 'start', type: 'start' },
      { id: 'loop', type: 'process' },
      { id: 'end', type: 'end' }
    ];
    const edges = [
      { source: 'start', target: 'loop' },
      { source: 'loop', target: 'start' } // cycle, but no path to end
    ];
    const errors = validateWorkflowPath(nodes, edges);
    expect(errors).toContain('No complete path exists from start node start to end node end');
  });

  it('works when multiple start or end nodes exist (takes first found)', () => {
    const nodes = [
      { id: 'start1', type: 'start' },
      { id: 'start2', type: 'start' },
      { id: 'end1', type: 'end' },
      { id: 'end2', type: 'end' }
    ];
    const edges = [
      { source: 'start1', target: 'end1' }
    ];
    // Should validate path from start1 to end1
    const errors = validateWorkflowPath(nodes, edges);
    expect(errors).toEqual([]);
  });
});
