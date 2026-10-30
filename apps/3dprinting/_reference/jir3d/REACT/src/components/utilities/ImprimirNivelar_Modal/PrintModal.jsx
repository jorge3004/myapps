import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "reactstrap";
// import { element } from "prop-types";
import { PrintModal_Body } from "./PrintModal_Body";
import { PrintModal_Footer } from "./PrintModal_Footer";
import { Modal_Header } from "../../dashboard/modals/helper/Modal_Header";
import { getImpresoras } from "../../../store/thunks/thunksImpresoras";

export const PrintModal = ({ title }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState("")
  useEffect(() => {
    return () => {
      dispatch(getImpresoras())
    }
  }, [])

  return (
    <>
      <Modal isOpen={true}>
        <Modal_Header title={title} />
        <PrintModal_Body
          error={error}
        />
        <PrintModal_Footer
          setError={setError}
        />
      </Modal>
    </>
  );
};
