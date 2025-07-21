import { validateApiNodeConfig } from '../forms/ApiNodeConfig';

// Mock validateURL for isolated tests
jest.mock('./validateApiNodeConfig', () => {
    const originalModule = jest.requireActual('./validateApiNodeConfig');
    return {
        ...originalModule,
        validateURL: jest.fn(),
    };
});
import { validateURL } from '../forms/ApiNodeConfig';

describe('validateApiNodeConfig', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns error if nodeName is empty', () => {
        (validateURL as jest.Mock).mockReturnValue(true);
        const errors = validateApiNodeConfig('   ', 'http://example.com');
        expect(errors.nodeName).toBe('Node name is required');
        expect(errors.url).toBeUndefined();
    });

    it('returns error if url is empty', () => {
        (validateURL as jest.Mock).mockReturnValue(true);
        const errors = validateApiNodeConfig('Node1', '   ');
        expect(errors.url).toBe('URL is required');
        expect(errors.nodeName).toBeUndefined();
    });

    it('returns error if url is invalid', () => {
        (validateURL as jest.Mock).mockReturnValue(false);
        const errors = validateApiNodeConfig('Node1', 'invalid-url');
        expect(errors.url).toBe('Please enter a valid URL');
        expect(errors.nodeName).toBeUndefined();
    });

    it('returns no errors if nodeName and url are valid', () => {
        (validateURL as jest.Mock).mockReturnValue(true);
        const errors = validateApiNodeConfig('Node1', 'http://example.com');
        expect(errors).toEqual({});
    });

    it('returns both errors if both fields are empty', () => {
        (validateURL as jest.Mock).mockReturnValue(true);
        const errors = validateApiNodeConfig('   ', '   ');
        expect(errors.nodeName).toBe('Node name is required');
        expect(errors.url).toBe('URL is required');
    });
});
