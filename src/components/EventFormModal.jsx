import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { EventForm } from "./EventForm";

export default function EventFormModal({ isOpen, onClose, handleCreate }) {
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} size={{ lg: "lg" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="blue.600">Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EventForm onSubmit={handleCreate} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
