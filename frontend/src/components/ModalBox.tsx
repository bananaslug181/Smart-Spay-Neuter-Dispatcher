// components/ModalBox.tsx
// credit: https://dev.to/theedgebreaker/creating-a-simple-modal-component-in-react-with-typescript-for-beginners-42ac
import React from "react";
// @ts-expect-error
import '../index.css'

interface ModalProps {
  onClose: () => void;
}

export default function ModalBox({ onClose }: ModalProps) {
  return (
    <div className="modal">
      <div className="modal-content">
        <nav className="modal-content">
          <span className="text-lg">Modal</span>
          <button
            className="close"
            onClick={onClose}
          >
            &#10005;
          </button>
        </nav>
        <div className="modal-content">Hello Modal!</div>
      </div>
    </div>
  );
};
