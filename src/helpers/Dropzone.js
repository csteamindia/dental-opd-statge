import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const Dropzone = ({callback}) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  // Upload function to send files to server
  useEffect(() => {
    const cb = async () => {
      const formData = [];
      acceptedFiles.forEach(file => {
        formData.push(file);
      });
      callback(formData);
    }
    cb();
  }, [acceptedFiles]);

  const filesTable = () => (
    <table className='table table-bordered'>
      <thead>
        <tr>
          <th>Name</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        {acceptedFiles.map(file => (
          <tr key={file.path}>
            <td>{file.path}</td>
            <td>{(file.size / (1024 * 1024)).toFixed(2)} MB</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <div {...getRootProps({ className: 'dropzone' })} style={{ minHeight: '80px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        <div className='mt-3'>
          <i className='fas fa-upload fa-2x' /> <br />
          Drag n Drop or Click to Select files
        </div>
      </div>

      <br />
      {acceptedFiles.length > 0 && (
        <>
          {filesTable()}
        </>
      )}
    </>
  );
};

export default Dropzone;
