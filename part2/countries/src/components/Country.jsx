import Weather from './Weather'

const Country = ({ country }) => {
  const capital = country.capital?.[0]

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital {capital}</div>
      <div>Area {country.area}</div>

      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages ?? {}).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} width="160" />

      {capital && <Weather city={capital} />}
    </div>
  )
}

export default Country
