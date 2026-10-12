import type { DiaryEntry } from '../types'

const Diaries = ({ diaries }: { diaries: DiaryEntry[] }) => (
  <div>
    <h2>Diary entries</h2>
    {diaries.map((d) => (
      <div key={d.id}>
        <h3>{d.date}</h3>
        <div>visibility: {d.visibility}</div>
        <div>weather: {d.weather}</div>
      </div>
    ))}
  </div>
)

export default Diaries
