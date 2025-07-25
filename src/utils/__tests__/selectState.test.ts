import { selectState } from '../selectState';

describe('selectState', () => {
    afterEach(() => {
        // Reset state after each test to avoid state leakage
        selectState.setFalse();
    });

    it('should be false by default', () => {
        expect(selectState.hasOpenSelect).toBe(false);
    });

    it('setTrue sets hasOpenSelect to true', () => {
        selectState.setTrue();
        expect(selectState.hasOpenSelect).toBe(true);
    });

    it('setFalse sets hasOpenSelect to false', () => {
        selectState.setTrue();
        selectState.setFalse();
        expect(selectState.hasOpenSelect).toBe(false);
    });

    it('can toggle between true and false', () => {
        expect(selectState.hasOpenSelect).toBe(false);
        selectState.setTrue();
        expect(selectState.hasOpenSelect).toBe(true);
        selectState.setFalse();
        expect(selectState.hasOpenSelect).toBe(false);
    });
});