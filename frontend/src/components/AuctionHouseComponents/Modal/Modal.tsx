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
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          {title && <h2 className={styles.modalTitle}>{title}</h2>}
          <button
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  )

  return modalRoot ? createPortal(content, modalRoot) : content
}
