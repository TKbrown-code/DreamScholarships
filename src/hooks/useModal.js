import { useState } from "react";

export const useModal = () => {
  const [modal, setModal] = useState({
    visible: false,
    title: "",
    message: "",
    buttons: [],
  });

  const showModal = (title, message, buttons = []) => {
    setModal({ visible: true, title, message, buttons });
  };

  const closeModal = () => {
    setModal({ visible: false, title: "", message: "", buttons: [] });
  };

  return { modal, showModal, closeModal };
};
