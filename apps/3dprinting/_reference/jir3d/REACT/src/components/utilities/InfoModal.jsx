import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearModal } from "../../store/slices/utilSlice";
import { CloseButton, Modal, ModalBody, ModalHeader } from "reactstrap";
import { secondsToHms, toGrams } from "../../data/initializations";

export const InfoModal = () => {
  const { util } = useSelector((state) => state.util);
  const { name, thumbnail: src, x, y, z, filamento, time } = util.modal;
  const dispatch = useDispatch();

  const close = () => {
    dispatch(clearModal());
  };

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) dispatch(clearModal());
    };
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("keydown", close);
    };
  }, []);
  return (
    <Modal
      isOpen
      toggle={close}
      // fullscreen
    >
      <ModalHeader className="m-auto">
        <div className="d-flex align-self-center">
          <h6 className="m-auto">{name}</h6>
          <CloseButton className="align-self-center ms-3" onClick={close} />
        </div>
      </ModalHeader>
      <ModalBody className="d-block text-center">
        <img className="w-25" src={src} alt="id" />
        <hr />
        <div className="d-block">
          Dim (x,y,z): {x}x{y}x{z}mm
        </div>
        <hr />
        {util.price === "number" ? (
          <div className="d-block">
            Precio: ${toGrams(filamento * util.price)}
          </div>
        ) : (
          <div className="d-block">Precio: ${util.price}</div>
        )}
        <hr />
        <div className="d-block">Tiempo de impresión: {secondsToHms(time)}</div>
        <hr />
        <div className="d-block">
          Filamento: {parseFloat(filamento).toFixed(2)}m
        </div>
      </ModalBody>
    </Modal>
  );
};
