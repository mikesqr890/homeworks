
import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../context/AuthContext'
import './Chat.css'

export default function Chat() {
  const { user } = useAuth()

  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const bottomRef = useRef(null)
  const requestRef = useRef(0)

  const loadMessages = useCallback(async (showLoading = false) => {
    if (!user?.id) return

    const requestId = ++requestRef.current

    if (showLoading) setLoading(true)

    const { data, error: queryError } = await supabase
      .from('deyes_chat_messages')
      .select('id, user_id, sender_id, body, created_at')
      .eq('user_id', user.id)
      .order('id', { ascending: false })
      .limit(200)

    if (requestId !== requestRef.current) return

    if (queryError) {
      setError(queryError.message)
    } else {
      setMessages((data || []).reverse())
      setError('')
    }

    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return

    loadMessages(true)

    const channel = supabase
      .channel(`cliente-chat-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'deyes_chat_messages'
        },
        (payload) => {
          if (payload.new.user_id === user.id) {
            loadMessages()
          }
        }
      )
      .subscribe()

    const interval = setInterval(() => {
      loadMessages()
    }, 5000)

    return () => {
      requestRef.current += 1
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [user?.id, loadMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }, [messages])

  async function sendMessage(event) {
    event.preventDefault()

    const body = text.trim()

    if (!body || !user?.id || sending) return

    setSending(true)
    setError('')

    const { error: sendError } = await supabase
      .from('deyes_chat_messages')
      .insert({
        user_id: user.id,
        sender_id: user.id,
        body
      })

    if (sendError) {
      setError(sendError.message)
    } else {
      setText('')
      await loadMessages()
    }

    setSending(false)
  }

  function formatTime(date) {
    return new Date(date).toLocaleString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    })
  }

  return (
    <main className="container chat-page">
      <header className="chat-page-header">
        <span>DE'YES · ATENCIÓN PERSONALIZADA</span>
        <h1>Habla con nosotros</h1>
        <p>
          Consulta sobre productos, pedidos o asesoría
          para crear tu outfit ideal.
        </p>
      </header>

      <section className="chat-window">
        <div className="chat-window-header">
          <div className="chat-avatar">D</div>

          <div>
            <h2>Atención De'yes</h2>
            <p>Conversación con nuestra tienda</p>
          </div>

          <button
            type="button"
            onClick={() => loadMessages(true)}
          >
            Actualizar
          </button>
        </div>

        <div className="chat-messages" aria-live="polite">
          {loading ? (
            <p className="chat-placeholder">
              Cargando conversación...
            </p>
          ) : messages.length === 0 ? (
            <div className="chat-welcome">
              <h3>¡Bienvenido a De'yes!</h3>
              <p>
                Envíanos un mensaje y nuestro equipo
                podrá responderte por aquí.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isMine = message.sender_id === user?.id

              return (
                <div
                  key={message.id}
                  className={
                    isMine
                      ? 'chat-message mine'
                      : 'chat-message theirs'
                  }
                >
                  <div className="chat-bubble">
                    <p>{message.body}</p>
                    <small>
                      {formatTime(message.created_at)}
                    </small>
                  </div>
                </div>
              )
            })
          )}

          <div ref={bottomRef} />
        </div>

        {error && (
          <p className="chat-error" role="alert">
            {error}
          </p>
        )}

        <form
          className="chat-compose"
          onSubmit={sendMessage}
        >
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Escribe tu mensaje..."
            maxLength={2000}
            aria-label="Mensaje"
            disabled={sending}
          />

          <button
            type="submit"
            disabled={sending || !text.trim()}
          >
            {sending ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </section>
    </main>
  )
}
