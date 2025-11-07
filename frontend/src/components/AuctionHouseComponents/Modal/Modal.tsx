import { createPortal } from 'react-dom'
import type { ModalProps } from '../../../types/ui'
import styles from './Modal.module.css'

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  const modalRoot =
    typeof document !== 'undefined'
      ? document.getElementById('modal-root') ||
        (() => {
          const div = document.createElement('div')
          div.id = 'modal-root'
          document.body.appendChild(div)
          return div
        })()
      : null

  const content = (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )

  return modalRoot ? createPortal(content, modalRoot) : content
}
