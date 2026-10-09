import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => setCountries(response.data))
  }, [])

  const matches = query
    ? countries.filter((c) => c.name.common.toLowerCase().includes(query.toLowerCase()))
    : []
  const exact = matches.find((c) => c.name.common.toLowerCase() === query.toLowerCase())

  return (
    <div>
      <div>
        find countries <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      {query && <Countries countries={exact ? [exact] : matches} onShow={setQuery} />}
    </div>
  )
}

export default App
