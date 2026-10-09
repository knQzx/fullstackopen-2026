import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons))
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const resetForm = () => {
    setNewName('')
    setNewNumber('')
  }

  const updateNumber = (person) => {
    const ok = window.confirm(
      `${person.name} is already added to phonebook, replace the old number with a new one?`,
    )
    if (!ok) {
      return
    }

    personService
      .update(person.id, { ...person, number: newNumber })
      .then((returnedPerson) => {
        setPersons(persons.map((p) => (p.id === person.id ? returnedPerson : p)))
        notify(`Changed number of ${returnedPerson.name}`)
        resetForm()
      })
      .catch(() => {
        notify(`Information of ${person.name} has already been removed from server`, 'error')
        setPersons(persons.filter((p) => p.id !== person.id))
      })
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existing = persons.find((p) => p.name === newName)

    if (existing) {
      updateNumber(existing)
      return
    }

    personService.create({ name: newName, number: newNumber }).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson))
      notify(`Added ${returnedPerson.name}`)
      resetForm()
    })
  }

  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name} ?`)) {
      return
    }

    personService
      .remove(person.id)
      .then(() => setPersons(persons.filter((p) => p.id !== person.id)))
      .catch(() => {
        notify(`Information of ${person.name} has already been removed from server`, 'error')
        setPersons(persons.filter((p) => p.id !== person.id))
      })
  }

  const personsToShow = persons.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase()),
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />

      <h3>add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        name={newName}
        onNameChange={(e) => setNewName(e.target.value)}
        number={newNumber}
        onNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App
