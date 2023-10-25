// FileInput.js
import React from 'react';

const FileInput = ({ onFileUpload }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    onFileUpload(file);
  };

  return (
    <input type="file" accept="image/*" className="form-control" id="preInstalledImage" onChange={handleFileUpload} />
  );
};

export default FileInput;
