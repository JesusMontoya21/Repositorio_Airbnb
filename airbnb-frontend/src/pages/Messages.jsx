import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Messages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const bookingId = searchParams.get('booking');
  const conversationParam = searchParams.get('conversation');

  const [selectedConversationId, setSelectedConversationId] = useState(conversationParam ? Number(conversationParam) : null);
  const [draft, setDraft] = useState('');
  const [attachmentFile, setAttachmentFile] = useState(null);

  const { data: conversations = [], isLoading: loadingConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await api.get('/conversations');
      return res.data;
    },
    refetchInterval: 5000,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data;
    },
    refetchInterval: 10000,
  });

  const startConversationMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.post(`/conversations/from-booking/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      setSelectedConversationId(data.conversation_id);
      setSearchParams({ conversation: String(data.conversation_id) });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  useEffect(() => {
    if (bookingId && !Number.isNaN(Number(bookingId))) {
      startConversationMutation.mutate(Number(bookingId));
    }
  }, [bookingId]);

  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
      setSearchParams({ conversation: String(conversations[0].id) });
    }
  }, [conversations, selectedConversationId, setSearchParams]);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', selectedConversationId],
    queryFn: async () => {
      const res = await api.get(`/conversations/${selectedConversationId}/messages`);
      return res.data;
    },
    enabled: !!selectedConversationId,
    refetchInterval: 3000,
  });

  const markReadMutation = useMutation({
    mutationFn: (conversationId) => api.post(`/conversations/${conversationId}/mark-read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  useEffect(() => {
    if (selectedConversationId && messages.length > 0) {
      markReadMutation.mutate(selectedConversationId);
    }
  }, [selectedConversationId, messages.length]);

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (draft.trim()) {
        formData.append('body', draft.trim());
      }
      if (attachmentFile) {
        formData.append('attachment', attachmentFile);
      }

      const res = await api.post(`/conversations/${selectedConversationId}/messages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return res.data;
    },
    onSuccess: () => {
      setDraft('');
      setAttachmentFile(null);
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markNotificationReadMutation = useMutation({
    mutationFn: (id) => api.post(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const handleSend = (event) => {
    event.preventDefault();
    if (!selectedConversationId || (!draft.trim() && !attachmentFile)) {
      return;
    }
    sendMessageMutation.mutate();
  };

  const downloadAttachment = async (attachment) => {
    const res = await api.get(`/messages/attachments/${attachment.id}/download`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(res.data);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = attachment.original_name || 'adjunto';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  };

  if (loadingConversations) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Mensajería en tiempo real</h1>

      {conversations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <div className="text-5xl mb-3">💬</div>
          <p className="text-gray-600 mb-4">Aún no tienes conversaciones.</p>
          <Link to="/my-bookings" className="inline-block bg-[#FF385C] text-white px-6 py-3 rounded-lg hover:bg-[#E0314F] transition">
            Ir a mis reservas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 bg-white rounded-xl shadow-md p-4 max-h-[72vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3">Conversaciones</h2>
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => {
                    setSelectedConversationId(conversation.id);
                    setSearchParams({ conversation: String(conversation.id) });
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition ${selectedConversationId === conversation.id ? 'border-[#FF385C] bg-[#FFF1F4]' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 line-clamp-1">
                        {conversation.property?.title || 'Conversación'}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {conversation.other_user?.name || 'Participante'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {conversation.last_message?.body || 'Sin mensajes'}
                      </p>
                    </div>
                    {conversation.unread_count > 0 && (
                      <span className="bg-[#FF385C] text-white text-xs px-2 py-1 rounded-full">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="lg:col-span-8 bg-white rounded-xl shadow-md flex flex-col max-h-[72vh]">
            {activeConversation ? (
              <>
                <div className="border-b px-5 py-4">
                  <p className="font-semibold text-gray-900">{activeConversation.property?.title}</p>
                  <p className="text-sm text-gray-600">Chat con {activeConversation.other_user?.name}</p>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {loadingMessages ? (
                    <div className="text-gray-500 text-sm">Cargando mensajes...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-gray-500 text-sm">Sin mensajes todavía.</div>
                  ) : (
                    messages.map((message) => {
                      const mine = message.sender_id && user?.id === message.sender_id;
                      return (
                        <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${mine ? 'bg-[#FF385C] text-white' : 'bg-gray-100 text-gray-900'}`}>
                            {message.type === 'template' && (
                              <p className="text-[11px] uppercase tracking-wide opacity-75 mb-1">Plantilla automática</p>
                            )}
                            {message.body && <p className="whitespace-pre-wrap break-words text-sm">{message.body}</p>}
                            {message.attachment && (
                              <button
                                type="button"
                                onClick={() => downloadAttachment(message.attachment)}
                                className={`mt-2 inline-flex items-center gap-2 text-xs underline ${mine ? 'text-white' : 'text-[#FF385C]'}`}
                              >
                                📎 {message.attachment.original_name}
                              </button>
                            )}
                            <p className={`mt-1 text-[11px] ${mine ? 'text-white/80' : 'text-gray-500'}`}>
                              {new Date(message.created_at).toLocaleString('es-MX')}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleSend} className="border-t px-4 py-3 bg-gray-50 rounded-b-xl">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#FF385C]"
                    />
                    <label className="border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 text-center">
                      Adjuntar
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={sendMessageMutation.isPending}
                      className="bg-[#FF385C] text-white px-5 py-2 rounded-lg hover:bg-[#E0314F] disabled:opacity-60"
                    >
                      Enviar
                    </button>
                  </div>
                  {attachmentFile && (
                    <p className="text-xs text-gray-600 mt-2">Adjunto: {attachmentFile.name}</p>
                  )}
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">Selecciona una conversación</div>
            )}
          </section>

          <aside className="lg:col-span-12 bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Notificaciones</h2>
              <span className="text-sm text-gray-500">Actualización automática</span>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">Sin notificaciones por ahora.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => {
                      if (!notification.is_read) {
                        markNotificationReadMutation.mutate(notification.id);
                      }
                      const conversationId = notification.data?.conversation_id;
                      if (conversationId) {
                        setSelectedConversationId(conversationId);
                        setSearchParams({ conversation: String(conversationId) });
                      }
                    }}
                    className={`w-full text-left border rounded-lg p-3 transition ${notification.is_read ? 'border-gray-200 bg-white' : 'border-[#FFCBD5] bg-[#FFF4F6]'}`}
                  >
                    <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{notification.body}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString('es-MX')}</p>
                  </button>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
