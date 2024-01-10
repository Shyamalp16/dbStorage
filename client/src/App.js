import React, { useState } from 'react'
import axios from 'axios'
import './App.css'
import Navbar from './Components/Navbar'
import FileList from './Components/FileList'

const App = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="body">
      <Navbar/>
      <div className="container">
        <div className="filesHeader">
          <h1> FILES </h1>
        </div>
          <form className="fileUpload">
            <input type="file" className="fileUpload" onChange={handleFileChange} />
            <input type="button" value="Upload" className="fileButton" onClick={handleUpload} />
          </form>
      </div>
      <FileList />
    </div>
  )
}

export default App;