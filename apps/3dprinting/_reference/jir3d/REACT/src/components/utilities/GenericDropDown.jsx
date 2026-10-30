import React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import * as FaIcons from "react-icons/fa";
import { defaults } from "../../data/initializations";
import { useDispatch, useSelector } from "react-redux";
import { jir3dRoles } from "../../helpers/jir3dRoles";
import { editUser } from "../../store/thunks/thunksUsers";
export const GenericDropDown = (
  {
    action = 'none',
    tmp = {}
  }
) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { impresoras } = useSelector((state) => state.impresoras.impresoras);
  const { user } = useSelector((state) => state.user);
  const { adminFetch } = jir3dRoles(user)
  const printer = action === "userPrinter" && impresoras.find((impresora) => impresora.iid === tmp?.iid);
  const printersArray = action === "userPrinter" && impresoras.map((impresora) => ((printer?.nombre != impresora.nombre && impresora.nombre)))
  const dispatch = useDispatch();
  const dropDownValues =
    action === 'userRole' ? defaults.tipo.options :
      action === 'userPrinter' ? printersArray :
        action === 'printersVisible' ? impresoras.map((printer) => printer.nombre) :
          [];
  const initialSelectedValue =
    action === 'userRole' ? tmp.tipo || '' :
      action === 'userPrinter' ? printer?.nombre || tmp.iid || '' :
        action === 'printersVisible' ? user.iidSelected || "all" :
          '';
  const valueAfterClickOnEraser =
    action === 'userRole' || action === 'userPrinter' ? '' :
      action === 'printersVisible' ? "all" :
        '';
  const isEraserActivated =
    action === 'userRole' ? tmp.tipo && adminFetch :
      action === 'userPrinter' ?
        (printer?.nombre && adminFetch) || (!adminFetch && (tmp.createdBy == user.uid) && !!tmp.iid) :
        action === 'printersVisible' ? user.iidSelected :
          false;
  const [selectedValue, setSelectedValue] = React.useState(initialSelectedValue);
  const isCrossed = action === 'userPrinter' ? !(printer?.nombre || !tmp.iid) : false;
  const caret =
    action === 'userRole' ? adminFetch :
      action === 'userPrinter' ? adminFetch || !tmp.iid :
        true;
  const onClickEraser = () => {
    action === 'userRole' ? dispatch(editUser({ tipo: '' }, tmp.uid)) :
      action === 'userPrinter' ? dispatch(editUser({ iid: 0 }, tmp.uid)) :
        action === 'printersVisible' ? dispatch(editUser({ iidSelected: '' }, user.uid)) :
          () => { console.log('nothing to do') }
    setSelectedValue(valueAfterClickOnEraser);
  }
  const onClickSelectedValue = (value) => {
    action === 'userRole' ? dispatch(editUser({ tipo: value }, tmp.uid)) :
      action === 'userPrinter' ? dispatch(editUser({ iid: impresoras.find((impresora) => impresora.nombre === value)?.iid }, tmp.uid)) :
        action === 'printersVisible' ? dispatch(editUser({ iidSelected: value }, user.uid)) :
          () => { console.log('nothing to do') }
    setSelectedValue(value);
  }
  return (
    <Dropdown
      isOpen={
        caret && dropdownOpen
      }
      toggle={() => {
        setDropdownOpen(!dropdownOpen);
      }}
    >
      {
        <DropdownToggle
          caret={caret}
          className={
            `${user.darkMode ? 'bg-dark' : 'bg-secondary'} 
            ${isCrossed && 'text-danger text-decoration-line-through'}
            p-1 text-capitalize} `
          }
        >
          {selectedValue}
        </DropdownToggle>
      }
      {
        <DropdownMenu>
          {
            dropDownValues.map((item, index) => (
              item !== selectedValue &&
              <DropdownItem
                key={index}
                onClick={() => onClickSelectedValue(item)}
              >
                {item}
              </DropdownItem>
            ))
          }
        </DropdownMenu>
      }
      {
        isEraserActivated && (
          <FaIcons.FaEraser
            className={`${user.darkMode ? 'text-white' : 'text-dark'} ms-sm-4 ms-2`}
            onClick={onClickEraser}
          />
        )
      }
    </Dropdown>
  )
};