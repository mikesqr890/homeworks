
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import { supabase } from '../../services/supabase'
import { useAuth } from '../../context/AuthContext'
import '../Chat/Chat.css'

export default function AdminChat() {
  const { user } = useAuth()

  const [conversations, setConversations] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const selectedUserRef = useRef(null)
  const messagesRequestRef = useRef(0)
  const conversationsRequestRef = useRef(0)
  const bottomRef = useRef(null)

  // LISTA DE CONVERSACIONES POR CLIENTE

  const loadConversations = useCallback(async () => {
    const requestId = ++conversationsRequestRef.current

    const { data, error: queryError } = await supabase
      .from('deyes_chat_messages')
      .select('id, user_id, sender_id, body, created_at')
      .order('id', { ascending: false })
      .limit(1000)

    if (requestId !== conversationsRequestRef.current) return

    if (queryError) {
      setError(queryError.message)
      setLoading(false)
      return
    }

    const unique = new Map()

    for (const message of data || []) {
      if (!unique.has(message.user_id)) {
        unique.set(message.user_id, {
          user_id: message.user_id,
          lastMessage: message.body,
          lastDate: message.created_at,
          name: `Cliente ${message.user_id.slice(0, 8)}`
        })
      }
    }

    const result = [...unique.values()]

    // Obtener nombres de perfiles cuando estén disponibles
    if (result.length > 0) {
      const clientIds = result.map((item) => item.user_id)

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', clientIds)

      if (requestId !== conversationsRequestRef.current) return

      if (!profilesError) {
        const names = new Map(
          (profiles || []).map((profile) => [
            profile.id,
            profile.full_name
          ])
        )

        for (const conversation of result) {
          conversation.name =
            names.get(conversation.user_id) ||
            conversation.name
        }
      }
    }

    setConversations(result)
    setError('')
    setLoading(false)
  }, [])

  // MENSAJES DE LA CONVERSACIÓN SELECCIONADA

  const loadMessages = useCallback(async (clientId) => {
    if (!clientId) return

    const requestId = ++messagesRequestRef.current

    const { data, error: queryError } = await supabase
      .from('deyes_chat_messages')
      .select('id, user_id, sender_id, body, created_at')
      .eq('user_id', clientId)
      .order('id', { ascending: false })
      .limit(200)

    if (
      requestId !== messagesRequestRef.current ||
      selectedUserRef.current !== clientId
    ) {
      return
    }

    if (queryError) {
      setError(queryError.message)
    } else {
      setMessages((data || []).reverse())
      setError('')
    }

    setLoadingMessages(false)
  }, [])

  // CARGA INICIAL

  useEffect(() => {
    loadConversations()

    return () => {
      conversationsRequestRef.current += 1
    }
  }, [loadConversations])

  // SELECCIÓN DE CLIENTE

  function selectConversation(clientId) {
    if (selectedUserRef.current === clientId) return

    messagesRequestRef.current += 1
    selectedUserRef.current = clientId

    setSelectedUser(clientId)
    setMessages([])
    setText('')
    setError('')
    setLoadingMessages(true)
  }

  useEffect(() => {
    if (!selectedUser) return

    loadMessages(selectedUser)
  }, [selectedUser, loadMessages])

  // REALTIME Y RESPALDO DE ACTUALIZACIÓN

  useEffect(() => {
    const channel = supabase
      .channel('deyes-admin-all-conversations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'deyes_chat_messages'
        },
        (payload) => {
          loadConversations()

          if (payload.new.user_id === selectedUserRef.current) {
            loadMessages(payload.new.user_id)
          }
        }
      )
      .subscribe()

    const interval = setInterval(() => {
      loadConversations()

      if (selectedUserRef.current) {
        loadMessages(selectedUserRef.current)
      }
    }, 5000)

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [loadConversations, loadMessages])

  // SCROLL AUTOMÁTICO

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }, [messages])

  // ENVIAR RESPUESTA

  async function sendMessage(event) {
    event.preventDefault()

    const body = text.trim()
    const clientId = selectedUserRef.current

    if (
      !body ||
      !clientId ||
      !user?.id ||
      sending ||
      loadingMessages
    ) {
      return
    }

    setSending(true)
    setError('')

    const { error: sendError } = await supabase
      .from('deyes_chat_messages')
      .insert({
        user_id: clientId,
        sender_id: user.id,
        body
      })

    if (sendError) {
      setError(sendError.message)
    } else {
      if (selectedUserRef.current === clientId) {
        setText('')
      }

      await Promise.all([
        loadConversations(),
        loadMessages(clientId)
      ])
    }

    setSending(false)
  }

  function formatTime(date) {
    return new Date(date).toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const selectedConversation = conversations.find(
    (conversation) => conversation.user_id === selectedUser
  )

  return (
    <main className="container chat-page admin-chat-page">
      <header className="chat-page-header">
        <span>DE'YES · ADMINISTRACIÓN</span>
        <h1>Atención a clientes</h1>
        <p>
          Gestiona las conversaciones de tus clientes
          desde un mismo lugar.
        </p>
      </header>

      {error && (
        <p className="chat-error" role="alert">
          {error}
        </p>
      )}

      <div className="admin-chat-layout">

        {/* LISTA DE CLIENTES */}

        <aside className="chat-conversations">
          <div className="chat-sidebar-header">
            <h2>Conversaciones</h2>

            <button
              type="button"
              onClick={() => loadConversations()}
            >
              Actualizar
            </button>
          </div>

          {loading ? (
            <p className="chat-sidebar-empty">
              Cargando conversaciones...
            </p>
          ) : conversations.length === 0 ? (
            <p className="chat-sidebar-empty">
              Aún no hay mensajes de clientes.
            </p>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.user_id}
                type="button"
                onClick={() =>
                  selectConversation(conversation.user_id)
                }
                className={
                  selectedUser === conversation.user_id
                    ? 'chat-conversation active'
                    : 'chat-conversation'
                }
              >
                <span className="chat-client-avatar">
                  {conversation.name.charAt(0).toUpperCase()}
                </span>

                <span className="chat-conversation-info">
                  <strong>{conversation.name}</strong>

                  <small>
                    {conversation.lastMessage}
                  </small>
                </span>
              </button>
            ))
          )}
        </aside>

        {/* CONVERSACIÓN INDIVIDUAL */}

        <section className="chat-window admin-chat-window">
          {!selectedUser ? (
            <div className="chat-select-prompt">
              <h2>Selecciona una conversación</h2>

              <p>
                Elige un cliente de la lista para leer
                sus mensajes y responderle.
              </p>
            </div>
          ) : (
            <>
              <div className="chat-window-header">
                <div className="chat-avatar">
                  {selectedConversation?.name
                    ?.charAt(0)
                    .toUpperCase() || 'C'}
                </div>

                <div>
                  <h2>
                    {selectedConversation?.name ||
                      `Cliente ${selectedUser.slice(0, 8)}`}
                  </h2>

                  <p>Conversación individual</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setLoadingMessages(true)
                    loadMessages(selectedUser)
                  }}
                >
                  Actualizar
                </button>
              </div>

              <div className="chat-messages" aria-live="polite">
                {loadingMessages ? (
                  <p className="chat-placeholder">
                    Cargando mensajes...
                  </p>
                ) : messages.length === 0 ? (
                  <p className="chat-placeholder">
                    No hay mensajes en esta conversación.
                  </p>
                ) : (
                  messages.map((message) => {
                    const isMine =
                      message.sender_id === user?.id

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

              <form
                className="chat-compose"
                onSubmit={sendMessage}
              >
                <input
                  type="text"
                  value={text}
                  onChange={(event) =>
                    setText(event.target.value)
                  }
                  placeholder="Escribe una respuesta..."
                  maxLength={2000}
                  aria-label="Respuesta para el cliente"
                  disabled={sending || loadingMessages}
                />

                <button
                  type="submit"
                  disabled={
                    sending ||
                    loadingMessages ||
                    !text.trim()
                  }
                >
                  {sending ? 'Enviando...' : 'Responder'}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
