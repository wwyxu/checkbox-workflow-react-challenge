import { createWorkFlowSave, getInitialData } from '../workflow';
import { LOCAL_STORAGE_KEY } from '@/constants';

global.localStorage = {
    store: {},
    getItem(key: string) { return this.store[key] || null; },
    setItem(key: string, value: string) { this.store[key] = value; },
    clear() { this.store = {}; },
    removeItem(key: string) { delete this.store[key]; },
    get length() { return Object.keys(this.store).length; },
    key(index: number) { return Object.keys(this.store)[index] || null; }
};

describe('createWorkFlowSave', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.useFakeTimers().setSystemTime(new Date('2023-01-01T00:00:00Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
        localStorage.clear();
    });

    it('should save workflow config to localStorage', () => {
        const nodes = [
            { id: '1', type: 'form', position: { x: 1, y: 2 }, data: { label: 'Form Node' } },
            { id: '2', type: 'api', position: { x: 3, y: 4 }, data: { label: 'Api Node' } }
        ];
        const edges = [
            { id: 'e1', source: '1', target: '2', label: 'Edge from 1 to 2' }
        ];
        createWorkFlowSave(nodes, edges);

        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        expect(saved).not.toBeNull();
        const parsed = JSON.parse(saved!);

        expect(parsed.nodes).toEqual(nodes);
        expect(parsed.edges).toEqual(edges);
        expect(parsed.metadata.name).toBe('Sample Workflow');
        expect(parsed.metadata.version).toBe('1.0.0');
        expect(parsed.metadata.created).toBe('2023-01-01T00:00:00.000Z');
    });
});

describe('getInitialData', () => {
    beforeEach(() => localStorage.clear());

    it('should return workflow config if present in localStorage', () => {
        const nodes = [
            { id: '1', type: 'form', position: { x: 1, y: 2 }, data: { label: 'Form Node' } }
        ];
        const edges = [
            { id: 'e1', source: '1', target: '2', label: 'Edge from 1 to 2' }
        ];
        const config = {
            nodes,
            edges,
            metadata: { name: 'Test', version: '1.0.0', created: 'date' }
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
        const result = getInitialData();
        expect(result).toEqual({ initialNodes: nodes, initialEdges: edges });
    });

    it('should return empty arrays if no data in localStorage', () => {
        const result = getInitialData();
        expect(result).toEqual({ initialNodes: [], initialEdges: [] });
    });

    it('should return empty arrays if localStorage data is invalid', () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, '{"foo":1}');
        const result = getInitialData();
        expect(result).toEqual({ initialNodes: [], initialEdges: [] });
    });

    it('should handle JSON parse error gracefully', () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, 'not-json');
        // Suppress error output
        jest.spyOn(console, 'error').mockImplementation(() => { });
        const result = getInitialData();
        expect(result).toEqual({ initialNodes: [], initialEdges: [] });
        (console.error as jest.Mock).mockRestore();
    });
});