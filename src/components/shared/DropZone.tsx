'use client'

import { useRef, useState } from 'react'

interface DropZoneProps {
  onDrop: (files: FileList) => void
  children: React.ReactNode
}

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

export function DropZone({ onDrop, children }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFiles = (files: FileList): boolean => {
    return Array.from(files).every(file => ACCEPTED_TYPES.includes(file.type))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && validateFiles(e.dataTransfer.files)) {
      onDrop(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && validateFiles(e.target.files)) {
      onDrop(e.target.files)
    }
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept={ACCEPTED_TYPES.join(',')}
        multiple
      />
      {children}
    </div>
  )
} 