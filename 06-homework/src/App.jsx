import { useState } from 'react'
import './App.css'

function App() {
  const [people, setPeople] = useState([
    {
      name: 'Carlos Pérez',
      amount: 500000,
      arrivalDate: '2026-09-24T08:15:00'
    },
    {
      name: 'Laura Gómez',
      amount: 300000,
      arrivalDate: '2026-09-24T08:25:00'
    },
    {
      name: 'Andrés Rodríguez',
      amount: 800000,
      arrivalDate: '2026-09-24T08:40:00'
    }
  ])

  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  const generateRandomDate = () => {
    const date = new Date()

    const randomMinutes = Math.floor(Math.random() * 60)
    const randomSeconds = Math.floor(Math.random() * 60)

    date.setMinutes(date.getMinutes() + randomMinutes)
    date.setSeconds(randomSeconds)

    return date.toISOString()
  }

  const addPerson = (event) => {
    event.preventDefault()

    const newPerson = {
      name,
      amount: Number(amount),
      arrivalDate: generateRandomDate()
    }

    setPeople([...people, newPerson])

    setName('')
    setAmount('')
  }

  const removePerson = () => {
    if (people.length > 0) {
      setPeople(people.slice(1))
    }
  }

  const sortedPeople = people
    .slice()
    .sort(
      (a, b) =>
        new Date(a.arrivalDate) - new Date(b.arrivalDate)
    )

  return (
    <div className="container">
      <h1>Cola de Personas - ATM</h1>

      <p className="description">
        Estructura de datos tipo Queue - FIFO
      </p>

      <div className="content">
        <section className="form-section">
          <h2>Agregar persona</h2>

          <form onSubmit={addPerson}>
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Monto del retiro"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
            />

            <button type="submit">
              Agregar a la cola
            </button>
          </form>

          <button
            className="remove-button"
            onClick={removePerson}
            disabled={people.length === 0}
          >
            Atender primera persona
          </button>
        </section>

        <section className="queue-section">
          <h2>Cola del ATM</h2>

          {sortedPeople.length === 0 ? (
            <p className="empty">
              No hay personas en la cola
            </p>
          ) : (
            <div className="queue">
              {sortedPeople.map((person, index) => (
                <div className="person" key={index}>
                  {index === 0 && (
                    <span className="first-label">
                      PRÓXIMO
                    </span>
                  )}

                  <h3>{person.name}</h3>

                  <p>
                    <strong>Monto:</strong> $
                    {person.amount.toLocaleString('es-CO')}
                  </p>

                  <p>
                    <strong>Llegada:</strong>{' '}
                    {new Date(
                      person.arrivalDate
                    ).toLocaleString('es-CO')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default App