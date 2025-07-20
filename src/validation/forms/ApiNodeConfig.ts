import { Models } from "@/models";

const validateURL = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const validateApiNodeConfig = (nodeName, url) => {
    const newErrors: Models.ValidationErrors = {};

    if (!nodeName.trim()) {
        newErrors.nodeName = 'Node name is required';
    }

    if (!url.trim()) {
        newErrors.url = 'URL is required';
    } else if (!validateURL(url)) {
        newErrors.url = 'Please enter a valid URL';
    }

    return newErrors;
};

export { validateApiNodeConfig };