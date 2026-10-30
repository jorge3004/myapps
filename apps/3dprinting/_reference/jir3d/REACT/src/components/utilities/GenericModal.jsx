import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import { useCloseModal } from "../../hooks/useCloseModal";
import { useForm } from "../../hooks/useForm";
import { useFormSwitches } from "../../hooks/useFormSwitches";
import { useGenericModalLabels } from "../../hooks/useGenericModalLabels";
import { GenericButtons } from "./GenericButtons";
import { GenericModalError } from "./GenericModalError";
import { GenericModalForm } from "./GenericModalForm";
import { GenericModalTitle } from "./GenericModalTitle";
import { GenericSwitches } from "./GenericSwitches";
import { Loading } from "./Loading";
export const GenericModal = (props) => {
  const { action, tmp, setModal } = props
  // const estado = !!util?.modal?.isActive && util.modal.isActive;
  // const { scripts } = useSelector((state) => state.scripts);
  // const { util } = useSelector((state) => state.util);
  // console.log(tmp)
  const {
    formInputValues,
    formswitchValues,
    switchLabel,
    cancelLabel,
    submitLabel,
    submitError
  } = useGenericModalLabels(action, tmp)
  const [inputValues, handleInputChange] = useForm(formInputValues);
  const [switchValues, handleSwitchChange] = useFormSwitches(formswitchValues)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const closeModal = useCloseModal(setModal)
  const modalFormProps = {
    switchLabel,
    handleInputChange,
    inputValues,
    error,
    action,
  }
  const modalTitleProps = {
    action,
    tmp,
    closeModal
  }
  const cancelProps = {
    action,
    closeModal,
    type: 'cancel',
    label: cancelLabel
  }
  const submitProps = {
    action,
    closeModal,
    type: 'submit',
    submitValues: { ...inputValues, ...switchValues },
    setLoading,
    setError,
    label: submitLabel,
    submitError,
    tmp
  }
  const switchProps = {
    switchLabel,
    handleSwitchChange,
    switchName: 'uploadActivated',
    switchValues
  }
  return (
    <>
      <Modal
        isOpen={true}
        autoFocus={false}
      >
        <ModalHeader
          className="justify-content-center "
        >
          <GenericModalTitle {...modalTitleProps} />
        </ModalHeader>
        {
          loading ?
            <Loading msg={""} />
            :
            <>
              {
                action !== 'delete' &&
                <ModalBody >
                  <GenericModalForm  {...modalFormProps} />
                  <GenericSwitches {...switchProps} />
                  <GenericModalError error={error} />
                </ModalBody>
              }
              <ModalFooter className="justify-content-center">
                <GenericButtons {...submitProps} />
                <GenericButtons {...cancelProps} />
              </ModalFooter>
            </>
        }
        {/* {
                action !== 'modalImg' &&
                <ModalFooter className="justify-content-center">
                  <GenericModalSubmit
                    cancelFunction={closeModal}
                    setLoading={setLoading}
                    action={action}
                    setError={setError}
                    submitValues={{ ...toggleSwitch, ...inputValues }}
                    tmp={tmp}
                    setModal={setModal}
                  />
                </ModalFooter>
              } */}

      </Modal >
    </>
  );
}