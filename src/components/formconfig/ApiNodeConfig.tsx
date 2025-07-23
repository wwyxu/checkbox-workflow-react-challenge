import { HttpTypes } from '@/constants';
import { Models } from '@/models';
import { getImmediatePrecedingFormNodes } from '@/utils';
import { validateApiNodeConfig } from '@/validation/forms/ApiNodeConfig';
import { AlertCircle } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

const APINodeConfig = ({ node, onSave, nodes, edges, onClose }) => {
  const [nodeName, setNodeName] = useState<string>(node?.data?.label || '');
  const [httpMethod, setHttpMethod] = useState<HttpTypes.POST | HttpTypes.PUT>(node?.data?.method || HttpTypes.POST);
  const [url, setUrl] = useState<string>(node?.data?.endpoint || '');
  const [selectedFields, setSelectedFields] = useState<string[]>(node?.data?.selectedFields || []);
  const [errors, setErrors] = useState<Models.ValidationErrors>({});

  // Get all fields from Form nodes that come before this API node
  const availableFields = useMemo<Models.FormField[]>(() => {
    const precedingFormNodes = getImmediatePrecedingFormNodes(node.id, nodes, edges);

    return precedingFormNodes || [];
  }, [nodes, edges, node.id]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Models.ValidationErrors = validateApiNodeConfig(nodeName, url);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [nodeName, url]);

  const handleFieldToggle = useCallback((fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  }, []);

  const handleSave = useCallback(() => {
    if (validateForm()) {
      onSave({
        ...node,
        data: {
          ...node.data,
          label: nodeName,
          method: httpMethod,
          endpoint: url,
          selectedFields,
        },
      });
    }
  }, [validateForm, onSave, node, nodeName, httpMethod, url, selectedFields]);

  return (
    <>
      {/* Node Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Node Name</label>
        <input
          type="text"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.nodeName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          placeholder="Enter node name"
        />
        {errors.nodeName && (
          <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.nodeName}
          </p>
        )}
      </div>

      {/* HTTP Method & URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">HTTP Method</label>
          <select
            value={httpMethod}
            onChange={(e) => setHttpMethod(e.target.value as HttpTypes.POST | HttpTypes.PUT)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-colors"
          >
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.url ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            placeholder="https://api.example.com/endpoint"
          />
          {errors.url && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.url}
            </p>
          )}
        </div>
      </div>

      {/* Request Body Fields */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">Request Body Fields</label>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          {availableFields.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <AlertCircle size={24} className="mx-auto" />
              </div>
              <p className="text-gray-500 text-sm">No form fields available. Add Form nodes to the nodes first.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableFields.map(field => (
                <label
                  key={`${field.nodeId}-${field.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field.id)}
                    onChange={() => handleFieldToggle(field.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">{field.name}</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {field.type}
                      </span>
                      {field.required && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">From: {field.nodeName}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm font-medium"
        >
          Close
        </button>
      </div>
    </>
  );
};

export default APINodeConfig;