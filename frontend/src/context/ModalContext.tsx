import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Modal, Button } from 'flowbite-react'


type ModalContextType = {
    openModal: (content: ReactNode) => void
    closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<ReactNode>(null)

  const openModal = (content: ReactNode) => {
    setModalContent(content)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalContent(null)
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isModalOpen && (
        <Modal show={isModalOpen} size="md" onClose={closeModal} popup>
          <Modal.Header />
          <Modal.Body>
            {modalContent}
          </Modal.Body>
        </Modal>
      )}
    </ModalContext.Provider>
  )
}


export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
