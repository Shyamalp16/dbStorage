import React from 'react'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './Components/Login';
import App from './App';
import FileList from './Components/FileList';

const router = createBrowserRouter([
    { path: '/', element: <App />},
    { path: '/login', element: <Login />},
    { path: '/filelist', element: <FileList />},
]);

function Router() {
  return (
    <RouterProvider router={router}/>
  )
}

export default Router