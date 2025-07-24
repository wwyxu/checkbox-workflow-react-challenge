let openSelectCount = false;

export const selectState = {
    setTrue: () => openSelectCount = true,
    setFalse: () => openSelectCount = false,
    get hasOpenSelect() { return openSelectCount; }
};
