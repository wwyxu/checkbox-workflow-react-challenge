import { validateFormNodeConfig } from '../../forms/FormNodeConfig';

describe('validateFormNodeConfig', () => {
    it('should return error if nodeName is missing', () => {
        const result = validateFormNodeConfig('', []);
        expect(result.nodeName).toBe('Node name is required');
    });

    it('should return error if nodeName is only whitespace', () => {
        const result = validateFormNodeConfig('   ', []);
        expect(result.nodeName).toBe('Node name is required');
    });

    it('should return error if fields is empty', () => {
        const result = validateFormNodeConfig('Form Node', []);
        expect(result.fields).toBe('At least one field must be configured');
    });

    it('should return error for fields with empty name', () => {
        const fields = [{ id: 'a', name: '' }, { id: 'b', name: '' }];
        const result = validateFormNodeConfig('Form Node', fields);
        expect(result['fields_a_name']).toBe('Field name is required');
        expect(result['fields_b_name']).toBe('Field name is required');
    });

    it('should return no error for valid input', () => {
        const fields = [{ id: 'a', name: 'Name' }, { id: 'b', name: 'Email' }];
        const result = validateFormNodeConfig('Form Node', fields);
        expect(result).toEqual({});
    });

    it('should combine errors', () => {
        const fields = [{ id: 'f1', name: '' }];
        const result = validateFormNodeConfig('', fields);
        expect(result.nodeName).toBe('Node name is required');
        expect(result.fields).toBeUndefined(); // fields length > 0, so no error for fields
        expect(result['fields_f1_name']).toBe('Field name is required');
    });

    it('should not break if fields has extra properties', () => {
        const fields = [{ id: 'f1', name: '', type: 'text' }];
        const result = validateFormNodeConfig('Node', fields);
        expect(result['fields_f1_name']).toBe('Field name is required');
    });
});
