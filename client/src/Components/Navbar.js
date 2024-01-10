import React from 'react'
import './Navbar.css'




function Navbar() {
  return (
    <div className="topHeader">
      <a className="fileButton" href="/login" > Log In </a>
      {/* <a className="fileButton" href="/login" > Sign Up </a> */}
    </div>
  )
}

export default Navbar;