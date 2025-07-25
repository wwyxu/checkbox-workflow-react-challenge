import { validateWorkflowPath, hasMoreThanOneInvalid } from '../../workflow/ValidPath';
import { moreThanOneInvalid } from '@/constants';

describe('validateWorkflowPath', () => {
    it('returns error if no start node', () => {
        const nodes = [{ id: '1', type: 'end' }];
        const edges: any[] = [];
        expect(validateWorkflowPath(nodes, edges)).toEqual(['No start node found']);
    });

    it('returns error if no end node', () => {
        const nodes = [{ id: '1', type: 'start' }];
        const edges: any[] = [];
        expect(validateWorkflowPath(nodes, edges)).toEqual(['No end node found']);
    });

    it('returns error if neither start nor end node', () => {
        const nodes = [{ id: '1', type: 'api' }];
        const edges: any[] = [];
        expect(validateWorkflowPath(nodes, edges)).toEqual([
            'No start node found',
            'No end node found'
        ]);
    });

    it('returns error if no complete path from start to end', () => {
        const nodes = [
            { id: 'start1', type: 'start' },
            { id: 'end1', type: 'end' }
        ];
        const edges: any[] = []; // no edges
        expect(validateWorkflowPath(nodes, edges)).toEqual([
            'No complete path exists from start node start1 to end node end1'
        ]);
    });

    it('returns empty array if there is a valid path from start to end', () => {
        const nodes = [
            { id: 'start1', type: 'start' },
            { id: 'api1', type: 'api' },
            { id: 'end1', type: 'end' }
        ];
        const edges = [
            { source: 'start1', target: 'api1' },
            { source: 'api1', target: 'end1' }
        ];
        expect(validateWorkflowPath(nodes, edges)).toEqual([]);
    });

    it('prevents infinite loop in cycles', () => {
        const nodes = [
            { id: 'start1', type: 'start' },
            { id: 'mid', type: 'api' },
            { id: 'end1', type: 'end' }
        ];
        const edges = [
            { source: 'start1', target: 'mid' },
            { source: 'mid', target: 'start1' }, // cycle
            { source: 'mid', target: 'end1' }
        ];
        expect(validateWorkflowPath(nodes, edges)).toEqual([]);
    });
});

describe('hasMoreThanOneInvalid', () => {
    beforeAll(() => {
        // Example moreThanOneInvalid for testing
        (moreThanOneInvalid as any).start = 'Cannot have more than one start node';
        (moreThanOneInvalid as any).end = 'Cannot have more than one end node';
        (moreThanOneInvalid as any).conditional = 'Cannot have more than one conditional node';
    });

    it('returns error for multiple start nodes', () => {
        const nodes = [
            { id: '1', type: 'start' },
            { id: '2', type: 'start' },
            { id: '3', type: 'api' }
        ];
        expect(hasMoreThanOneInvalid(nodes)).toContain('Cannot have more than one start node');
    });

    it('returns error for multiple end nodes', () => {
        const nodes = [
            { id: '1', type: 'end' },
            { id: '2', type: 'end' }
        ];
        expect(hasMoreThanOneInvalid(nodes)).toContain('Cannot have more than one end node');
    });

    it('returns multiple error messages if multiple types are duplicated', () => {
        const nodes = [
            { id: '1', type: 'start' },
            { id: '2', type: 'start' },
            { id: '3', type: 'end' },
            { id: '4', type: 'end' },
            { id: '5', type: 'conditional' },
            { id: '6', type: 'conditional' }
        ];
        const errors = hasMoreThanOneInvalid(nodes);
        expect(errors).toContain('Cannot have more than one start node');
        expect(errors).toContain('Cannot have more than one end node');
        expect(errors).toContain('Cannot have more than one conditional node');
    });

    it('returns empty array if no invalid counts', () => {
        const nodes = [
            { id: '1', type: 'start' },
            { id: '2', type: 'end' },
            { id: '3', type: 'api' }
        ];
        expect(hasMoreThanOneInvalid(nodes)).toEqual([]);
    });

    it('returns empty array for empty nodes', () => {
        expect(hasMoreThanOneInvalid([])).toEqual([]);
    });
});