export function downloadFile<T>(options: {
  data: T
  filename: string
  type?: string
}) {
  const { data, filename, type = 'application/json' } = options
  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
