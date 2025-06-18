import React, { useEffect, useState } from 'react'
import styles from '@/styles/Messages.module.scss'
import { useRouter } from 'next/router'

// 컴포넌트 내부




type Message = {
  id: number
  content: string
  sent_at: string
  is_read?: boolean
  sender_userid?: string
  sender_name?: string
  receiver_userid?: string
  receiver_name?: string
}


const Messages = () => {
  const [tab, setTab] = useState<'inbox' | 'sent' | 'send'>('inbox')
  const [messages, setMessages] = useState<Message[]>([])
  const [receiver, setReceiver] = useState('')
  const [content, setContent] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter();
  useEffect(() => {
    if (tab === 'inbox') {
      fetch('/api/message/inbox')
        .then(res => res.json())
        .then(data => setMessages(data))
    } else if (tab === 'sent') {
      fetch('/api/message/sent')
        .then(res => res.json())
        .then(data => setMessages(data))
    }
  }, [tab, refresh])

  const sendMessage = async () => {
    if (!receiver || !content) {
      setMessage('수신자와 내용을 입력하세요.')
      return
    }
    const res = await fetch('/api/message/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverUserid: receiver, content }),
    })
    const data = await res.json()
    setMessage(data.message || data.error)
    if (res.ok) {
      setReceiver('')
      setContent('')
      setRefresh(!refresh)
    }
  }

  const deleteMessage = async (id: number) => {
    const res = await fetch('/api/message/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId: id }),
    })
    const data = await res.json()
    setMessage(data.message || data.error)
    if (res.ok) setRefresh(!refresh)
  }

  const markAsRead = async (id: number) => {
    await fetch('/api/message/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId: id }),
    })
    setRefresh(!refresh)
    setShowModal(false)
  }

  const openModal = (msg: Message) => {
    setSelectedMsg(msg)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedMsg(null)
    setShowModal(false)
  }

  return (
    <div className={styles.messageoutbox}>
      <div className={styles.wrapper}>
        <button className={styles.closeMessagesBtn} onClick={() => router.back()}>
          닫기
        </button>
        <h2>쪽지함</h2>
        {/* {onClose && (
          <button className={styles.closeMessagesBtn} onClick={onClose}>
          ❌ 쪽지함 닫기
        </button>
        )} */}
        <div className={styles.tabs}>
          <button onClick={() => setTab('inbox')}>📥 받은 쪽지</button>
          <button onClick={() => setTab('sent')}>📤 보낸 쪽지</button>
          <button onClick={() => setTab('send')}>✉️ 쪽지 쓰기</button>
        </div>

        {tab === 'send' && (
          <div className={styles.form}>
            <input
              placeholder="수신자 ID"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />
            <textarea
              placeholder="내용 입력"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button onClick={sendMessage}>보내기</button>
            <p>{message}</p>
          </div>
        )}

        {tab !== 'send' && (
          <ul className={styles.list}>
            {messages.map((msg) => (
              <li key={msg.id} onClick={() => openModal(msg)}>
                <p><strong>
                  {tab === 'inbox'
                    ? `보낸 사람: ${msg.sender_name} (${msg.sender_userid})`
                    : `받는 사람: ${msg.receiver_name} (${msg.receiver_userid})`}
                </strong></p>
                <p>{msg.content}</p>
                <p>{new Date(msg.sent_at).toLocaleString()}</p>
                {tab === 'inbox' && !msg.is_read && (
                  <button onClick={(e) => {
                    e.stopPropagation()
                    markAsRead(msg.id)
                  }}>읽음 처리</button>
                )}
                <button className={styles.delbtn} onClick={(e) => {
                  e.stopPropagation()
                  deleteMessage(msg.id)
                }}>삭제</button>
              </li>
            ))}
          </ul>
        )}

        {showModal && selectedMsg && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={closeModal}>닫기</button>
              <h3>쪽지 내용</h3>
              <p><strong>
                {tab === 'inbox'
                  ? `보낸 사람: ${selectedMsg.sender_name} (${selectedMsg.sender_userid})`
                  : `받는 사람: ${selectedMsg.receiver_name} (${selectedMsg.receiver_userid})`}
              </strong></p>
              <p><strong>보낸 시간:</strong> {new Date(selectedMsg.sent_at).toLocaleString()}</p>
              <p><strong>내용:</strong></p>
              <p>{selectedMsg.content}</p>
              {tab === 'inbox' && !selectedMsg.is_read && (
                <button onClick={() => markAsRead(selectedMsg.id)}>읽음 처리</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages
