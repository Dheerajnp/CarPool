
import React from 'react'
import { Link } from 'react-router-dom'

const UserPage = () => {
  return (
    <>
        <div>UserPage</div>
        <Link to='/admin/dashboard' className='underline'>
                Goto Dashboard
        </Link>
    </>
    
  )
}

export default UserPage