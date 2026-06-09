'use client'

import { useEffect } from 'react'
import clsx from 'clsx'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children, actions }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <h2 className="text-xl font-bold text-brand-ink mb-4">{title}</h2>
        <div className="text-brand-muted mb-6">{children}</div>
        {actions && <div className="flex gap-3 justify-end">{actions}</div>}
      </div>
    </div>
  )
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
}

export function ConfirmModal({
  isOpen, onClose, onConfirm, title, message,
  confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'danger'
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      actions={
        <>
          <button onClick={onClose} className="px-4 py-2 text-brand-muted hover:text-brand-ink">
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            className={clsx(
              'px-4 py-2 rounded-xl font-bold text-white transition-colors',
              variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-brand-red hover:bg-brand-red-dark'
            )}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p>{message}</p>
    </Modal>
  )
}