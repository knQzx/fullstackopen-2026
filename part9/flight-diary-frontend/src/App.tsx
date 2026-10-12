import { useEffect, useState } from 'react'
import axios from 'axios'
import diaryService from './services/diaries'
import Diaries from './components/Diaries'
import NewDiaryForm from './components/NewDiaryForm'
import type { DiaryEntry, NewDiaryEntry } from './types'

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    diaryService.getAll().then(setDiaries)
  }, [])

  const showError = (message: string) => {
    setError(message)
    setTimeout(() => setError(null), 5000)
  }

  const addDiary = async (entry: NewDiaryEntry): Promise<boolean> => {
    try {
      const added = await diaryService.create(entry)
      setDiaries(diaries.concat(added))
      return true
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && typeof e.response?.data === 'string') {
        showError(e.response.data)
      } else {
        showError('Adding the entry failed')
      }
      return false
    }
  }

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <NewDiaryForm onSubmit={addDiary} />
      <Diaries diaries={diaries} />
    </div>
  )
}

export default App
