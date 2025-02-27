import React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const Modal = ({ show, className, children }) => {
  if (!show) return null;

  const classes = `modal bg-dark rounded px-4 py-6 shadow ${className}`;

  return createPortal(
    <div id="modal-backdrop">
      <motion.div
        animate={{ opacity: [0.75, 1], scale: [1.1, 1] }}
        transition={{ ease: "easeOut", duration: 0.15 }}
        className={classes}
      >
        {children}
      </motion.div>
    </div>,
    document.getElementById("modal-root")
  );
};

const ModalHeader = ({ className, children }) => {
  const classes = `modal-header d-flex align-items-center position-relative ${className}`;
  return <div className={classes}>{children}</div>;
};

const ModalBody = ({ className, children, onClick }) => {
  const classes = `modal-body my-8 ${className}`;
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

const ModalFooter = ({ className, children }) => {
  const classes = `modal-footer ${className}`;
  return <div className={classes}>{children}</div>;
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;