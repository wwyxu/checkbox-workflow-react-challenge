const ModalFooter = ({ 
  onSave, 
  onClose, 
  saveLabel = "Save", 
  closeLabel = "Close",
  saveDisabled = false,
  className = ""
}) => {
  return (
    <div className={`flex justify-end gap-3 pt-2 border-t border-gray-200 ${className}`}>
      <button
        type="button"
        onClick={onSave}
        disabled={saveDisabled}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors shadow-sm font-medium"
      >
        {saveLabel}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm font-medium"
      >
        {closeLabel}
      </button>
    </div>
  );
};

export default ModalFooter;
