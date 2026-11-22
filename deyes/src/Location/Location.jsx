
import './Location.css'

const store = {
  name: "De'yes",
  city: 'Florida',
  region: 'Valle del Cauca',
  country: 'Colombia',

  // Reemplazar cuando tengas la dirección exacta
  address: ''
}

export default function Location() {
  const generalLocation =
    `${store.city}, ${store.region}, ${store.country}`

  const mapLocation = store.address
    ? `${store.address}, ${generalLocation}`
    : generalLocation

  const mapUrl =
    `https://maps.google.com/maps?q=${
      encodeURIComponent(mapLocation)
    }&z=15&output=embed`

  const directionsUrl =
    `https://www.google.com/maps/search/?api=1&query=${
      encodeURIComponent(mapLocation)
    }`

  return (
    <main className="container location-page">
      <header className="location-header">
        <span>DE'YES · NUESTRA TIENDA</span>
        <h1>Encuéntranos</h1>

        <p>
          Estamos en Florida, Valle del Cauca.
          Descubre nuestra colección y crea
          tu outfit ideal con nosotros.
        </p>
      </header>

      <div className="location-layout">
        <section className="location-map">
          <iframe
            title="Mapa de la ubicación de De'yes"
            src={mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>

        <aside className="location-details">
          <span>VISÍTANOS</span>

          <h2>{store.name}</h2>

          <p>
            Tienda de ropa, calzado y accesorios.
          </p>

          <div className="location-detail">
            <strong>Municipio</strong>
            <p>{generalLocation}</p>
          </div>

          <div className="location-detail">
            <strong>Dirección</strong>

            <p>
              {store.address ||
                'Dirección exacta pendiente de confirmar.'}
            </p>
          </div>

          {!store.address && (
            <p className="location-note">
              El mapa muestra el municipio de Florida,
              no la ubicación exacta del establecimiento.
            </p>
          )}

          <a
            className="location-button"
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {store.address
              ? 'Cómo llegar a la tienda'
              : 'Ver Florida en Google Maps'}
          </a>

          <div className="location-detail">
            <strong>Asesoría personalizada</strong>

            <p>
              Puedes crear una combinación de prendas
              y consultar su disponibilidad desde
              Cápsula de Outfit.
            </p>
          </div>

          <a
            className="location-outfit-link"
            href="/outfits"
          >
            Crear mi outfit
          </a>
        </aside>
      </div>
    </main>
  )
}
