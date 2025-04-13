'use client'

import { useState } from 'react'

export default function FileUpload() {
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <input type="file" onChange={handleFileChange} className="p-2 border rounded" />
      {fileName && <p className="text-sm text-gray-600">Selected: {fileName}</p>}
    </div>
  )
}
