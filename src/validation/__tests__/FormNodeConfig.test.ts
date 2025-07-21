import { validateFormNodeConfig } from '../forms/FormNodeConfig';

describe('validateFormNodeConfig', () => {
    it('returns error if nodeName is empty', () => {
        const errors = validateFormNodeConfig('   ', [{ id: 1, name: 'Field1' }]);
        expect(errors.nodeName).toBe('Node name is required');
        expect(errors.fields).toBeUndefined();
        expect(errors['field_1_name']).toBeUndefined();
    });

    it('returns error if fields array is empty', () => {
        const errors = validateFormNodeConfig('Node1', []);
        expect(errors.fields).toBe('At least one field must be configured');
        expect(errors.nodeName).toBeUndefined();
    });

    it('returns error if field name is empty', () => {
        const errors = validateFormNodeConfig('Node1', [{ id: 2, name: '   ' }]);
        expect(errors['field_2_name']).toBe('Field name is required');
        expect(errors.nodeName).toBeUndefined();
        expect(errors.fields).toBeUndefined();
    });

    it('returns multiple errors for multiple invalid fields', () => {
        const fields = [
            { id: 1, name: '   ' },
            { id: 2, name: '   ' },
            { id: 3, name: 'Field3' },
        ];
        const errors = validateFormNodeConfig('Node1', fields);
        expect(errors['field_1_name']).toBe('Field name is required');
        expect(errors['field_2_name']).toBe('Field name is required');
        expect(errors['field_3_name']).toBeUndefined();
        expect(errors.nodeName).toBeUndefined();
        expect(errors.fields).toBeUndefined();
    });

    it('returns no errors for valid input', () => {
        const fields = [
            { id: 1, name: 'Field1' },
            { id: 2, name: 'Field2' },
        ];
        const errors = validateFormNodeConfig('Node1', fields);
        expect(errors).toEqual({});
    });

    it('returns both nodeName and fields errors if both are invalid', () => {
        const errors = validateFormNodeConfig('   ', []);
        expect(errors.nodeName).toBe('Node name is required');
        expect(errors.fields).toBe('At least one field must be configured');
    });

    it('handles dynamic field keys correctly', () => {
        const fields = [
            { id: 'abc', name: '   ' },
            { id: 'xyz', name: 'FieldX' },
        ];
        const errors = validateFormNodeConfig('NodeName', fields);
        expect(errors['field_abc_name']).toBe('Field name is required');
        expect(errors['field_xyz_name']).toBeUndefined();
    });
});
