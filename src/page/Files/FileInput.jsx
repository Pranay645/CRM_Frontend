// FileInput.js
import React from 'react';

const FileInput = ({ onFileUpload,funcName }) => {
  const handleFileUpload = (e,func) => {
    const file = e.target.files[0];
    
    onFileUpload(file,func);
    
  };

  return (
    <input type="file" accept="image/*" className="form-control" id="preInstalledImage" onChange={(e)=>handleFileUpload(e,funcName)} />
  );
};

export default FileInput;
