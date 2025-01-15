"use client"

import React from 'react'

export const UserNav: React.FC = () => {
  return (
    <div className="flex items-center">
      <span className="mr-2">User Name</span>
      <button className="px-3 py-1 bg-blue-500 text-white rounded">Logout</button>
    </div>
  )
} 