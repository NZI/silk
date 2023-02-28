import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React, { useRef } from "react";

type DeferredPromise<DeferType> = {
  resolve: (value: DeferType) => void;
  reject: (value: unknown) => void;
  promise: Promise<DeferType>;
}

export function useDeferredPromise<DeferType>() {
  const deferRef = useRef<DeferredPromise<DeferType> | null>(null);

  const defer = () => {
    const deferred = {} as DeferredPromise<DeferType>;

    const promise = new Promise<DeferType>((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });

    deferred.promise = promise;
    deferRef.current = deferred;
    return deferRef.current;
  };

  return { defer, deferRef: deferRef.current };
}

interface Props {
  title: string
  confirm: string
  cancel: string
  deferRef: DeferredPromise<boolean> | null
}

const DeferredDialog: React.FC<React.PropsWithChildren<Props>> = ({ title, children, confirm, deferRef }) => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true})



  const handleConfirm = () => {
    onClose()

    deferRef?.resolve(true);
  };

  const handleClose = () => {
    onClose()

    deferRef?.resolve(false);
  };

  return <Modal isOpen={isOpen} onClose={handleClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {children}
      </ModalBody>

      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={handleConfirm}>
          {confirm}
        </Button>
        <Button onClick={handleClose}>
          {confirm}
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
}
