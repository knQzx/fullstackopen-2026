import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { Visibility, Weather } from '../types'
import type { NewDiaryEntry } from '../types'

interface Props {
  onSubmit: (entry: NewDiaryEntry) => Promise<boolean>
}

const NewDiaryForm = ({ onSubmit }: Props) => {
  const [date, setDate] = useState('')
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great)
  const [weather, setWeather] = useState<Weather>(Weather.Sunny)
  const [comment, setComment] = useState('')

  const submit = async (event: SyntheticEvent) => {
    event.preventDefault()
    const ok = await onSubmit({ date, visibility, weather, comment })
    if (ok) {
      setDate('')
      setComment('')
    }
  }

  return (
    <div>
      <h2>Add new entry</h2>
      <form onSubmit={submit}>
        <div>
          date <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          visibility{' '}
          {Object.values(Visibility).map((v) => (
            <label key={v}>
              {v}
              <input
                type="radio"
                name="visibility"
                checked={visibility === v}
                onChange={() => setVisibility(v)}
              />
            </label>
          ))}
        </div>
        <div>
          weather{' '}
          {Object.values(Weather).map((w) => (
            <label key={w}>
              {w}
              <input type="radio" name="weather" checked={weather === w} onChange={() => setWeather(w)} />
            </label>
          ))}
        </div>
        <div>
          comment <input value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  )
}

export default NewDiaryForm
