export async function createThumbnail(originalUrl: string): Promise<string> {
    const res = await fetch('/api/create-thumbnail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl }),
    })
  
    if (!res.ok) throw new Error('썸네일 생성 실패')
  
    const data = await res.json()
    return data.thumbnailUrl
  }
  