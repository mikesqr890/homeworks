import { useEffect, useState } from "react";
import "./App.css";


// COMPONENTE LOADER
function Loader() {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <h2>Cargando contactos...</h2>
      <p>Preparando tu lista de contactos</p>
    </div>
  );
}


// COMPONENTE FORMULARIO
function ContactForm({ name, phone, setName, setPhone, addContact }) {
  return (
    <div className="form-container">

      <div className="section-title">
        <h2>Agregar contacto</h2>
        <p>Registra un nuevo contacto en tu agenda</p>
      </div>

      <div className="form">

        <div className="input-group">
          <label>Nombre</label>

          <input
            type="text"
            placeholder="Ej. Michael Quimbayo"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>


        <div className="input-group">
          <label>Teléfono</label>

          <input
            type="tel"
            placeholder="Ej. 3001234567"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>


        <button className="add-button" onClick={addContact}>
          + Agregar contacto
        </button>

      </div>

    </div>
  );
}


// COMPONENTE CONTACT ITEM
function ContactItem({ contact, deleteContact }) {
  return (
    <div className="contact-item">

      <div className="contact-info">

        <div className="contact-avatar">
          {contact.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3>{contact.name}</h3>
          <p>📞 {contact.phone}</p>
        </div>

      </div>


      <button
        className="delete-button"
        onClick={() => deleteContact(contact.id)}
      >
        Eliminar
      </button>

    </div>
  );
}


// COMPONENTE LISTA
function ContactList({ contacts, deleteContact }) {
  return (
    <div className="list-container">

      <div className="section-title list-title">

        <div>
          <h2>Mis contactos</h2>
          <p>Contactos registrados en tu agenda</p>
        </div>

        <span className="contact-count">
          {contacts.length}
        </span>

      </div>


      <div className="contacts">

        {contacts.length === 0 ? (

          <div className="empty">
            <p>No hay contactos registrados.</p>
          </div>

        ) : (

          contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              deleteContact={deleteContact}
            />
          ))

        )}

      </div>

    </div>
  );
}


// COMPONENTE PRINCIPAL
function App() {

  const [contacts, setContacts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");


  // CARGAR CONTACTOS INICIALES
  useEffect(() => {

    setTimeout(() => {

      const initialContacts = [
        {
          id: 1,
          name: "Carlos",
          phone: "3001234567"
        },
        {
          id: 2,
          name: "Laura",
          phone: "3109876543"
        },
        {
          id: 3,
          name: "Andrés",
          phone: "3154567890"
        }
      ];

      setContacts(initialContacts);

      setLoading(false);

    }, 2000);

  }, []);


  // AGREGAR CONTACTO
  const addContact = () => {

    if (name.trim() === "" || phone.trim() === "") {
      return;
    }

    const newContact = {
      id: Date.now(),
      name: name,
      phone: phone
    };

    setContacts([...contacts, newContact]);

    setName("");

    setPhone("");
  };


  // ELIMINAR CONTACTO
  const deleteContact = (id) => {

    const updatedContacts = contacts.filter(
      (contact) => contact.id !== id
    );

    setContacts(updatedContacts);
  };


  // LOADER
  if (loading) {
    return <Loader />;
  }


  // APLICACIÓN
  return (
    <div className="app">

      <header className="header">

        <div className="header-icon">
          ☎
        </div>

        <div>
          <h1>Mis contactos</h1>
          <p>Administra tu agenda de contactos</p>
        </div>

      </header>


      <ContactForm
        name={name}
        phone={phone}
        setName={setName}
        setPhone={setPhone}
        addContact={addContact}
      />


      <ContactList
        contacts={contacts}
        deleteContact={deleteContact}
      />

    </div>
  );
}


export default App;