import { validateForms } from '../../forms/ValidForms';
import { NodeTypes } from '@/constants';

// Mocks for form and api validation
jest.mock('../../forms/FormNodeConfig', () => ({
    validateFormNodeConfig: jest.fn(),
}));
jest.mock('../../forms/ApiNodeConfig', () => ({
    validateApiNodeConfig: jest.fn(),
}));

import { validateFormNodeConfig } from '../../forms/FormNodeConfig';
import { validateApiNodeConfig } from '../../forms/ApiNodeConfig';

describe('validateForms', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns empty array if all nodes are valid', () => {
        (validateFormNodeConfig as jest.Mock).mockReturnValue({});
        (validateApiNodeConfig as jest.Mock).mockReturnValue({});
        const nodes = [
            { id: '1', type: NodeTypes.FORM, data: { label: 'Form', fields: [] } },
            { id: '2', type: NodeTypes.API, data: { label: 'API', method: 'POST', endpoint: 'https://api.com' } },
            { id: '3', type: 'other', data: {} },
        ];
        expect(validateForms(nodes)).toEqual([]);
    });

    it('collects errors from FORM nodes', () => {
        (validateFormNodeConfig as jest.Mock).mockReturnValue({ nodeName: 'Form name required', fields: 'No fields' });
        (validateApiNodeConfig as jest.Mock).mockReturnValue({});
        const nodes = [
            { id: '1', type: NodeTypes.FORM, data: { label: '', fields: [] } },
            { id: '2', type: NodeTypes.API, data: { label: 'API', method: 'POST', endpoint: 'https://api.com' } },
        ];
        expect(validateForms(nodes)).toEqual([
            'Node 1 : Form name required, No fields'
        ]);
    });

    it('collects errors from API nodes', () => {
        (validateFormNodeConfig as jest.Mock).mockReturnValue({});
        (validateApiNodeConfig as jest.Mock).mockReturnValue({ url: 'Invalid URL' });
        const nodes = [
            { id: '2', type: NodeTypes.API, data: { label: 'API', method: 'POST', endpoint: '' } }
        ];
        expect(validateForms(nodes)).toEqual([
            'Node 2 : Invalid URL'
        ]);
    });

    it('collects errors from multiple nodes', () => {
        (validateFormNodeConfig as jest.Mock).mockReturnValue({ nodeName: 'Missing name' });
        (validateApiNodeConfig as jest.Mock).mockReturnValue({ httpMethod: 'Wrong method', url: 'Bad url' });
        const nodes = [
            { id: '1', type: NodeTypes.FORM, data: { label: '', fields: [] } },
            { id: '2', type: NodeTypes.API, data: { label: 'API', method: 'GET', endpoint: 'not-a-url' } }
        ];
        expect(validateForms(nodes)).toEqual([
            'Node 1 : Missing name',
            'Node 2 : Wrong method, Bad url'
        ]);
    });

    it('ignores nodes that are not FORM or API', () => {
        (validateFormNodeConfig as jest.Mock).mockReturnValue({});
        (validateApiNodeConfig as jest.Mock).mockReturnValue({});
        const nodes = [
            { id: '3', type: 'other', data: {} }
        ];
        expect(validateForms(nodes)).toEqual([]);
    });
});