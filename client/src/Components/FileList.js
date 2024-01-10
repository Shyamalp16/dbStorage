import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './FileList.css'
import Download from './Download';

function FileList() {
  const [files, setFiles] = useState([])

  useEffect(() => {
    // Fetch data and store it to files const using useState
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getFiles');
        setFiles(response.data.files);
        console.log(response.data.files)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <table class="styled-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Total Parts</th>
          <th>Download</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file, key) => {
        return (
        <tr key={key}>
          <td>{file.fileName}</td>
          <td>{file.totalParts}</td>
          <td><Download /></td>
        </tr>
        )
      })}
      </tbody>
    </table>
  )
}

export default FileList