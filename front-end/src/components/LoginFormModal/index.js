import React, { useState } from "react";
import { Modal } from "../../context/Modal";
import LoginForm from "./LoginForm";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
function LoginFormModal() {
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);

  const onClick = () => {
    if (sessionUser) history.push("/client");
    else setShowModal(true);
  };

  return (
    <>
      <button onClick={onClick} className="nav-txt nav-border">
        Log In
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <LoginForm />
        </Modal>
      )}
    </>
  );
}

export default LoginFormModal;
