import React from 'react';
import {
  Form,
} from "reactstrap";

export const GenericModalForm = (props) => {
  const {
    handleInputChange = () => console.log('Not handleInputChange function'),
    inputValues,
  } = props
  return (
    <>
      <Form id="form1">

        {
          // action === 'modalImg' ?
          //     <img
          //         src={tmp?.src}
          //         alt="img"
          //         className="w-100"
          //     />
          //     :
          <>
            {
              inputValues &&
              Object.keys(inputValues).map((element, index) => (
                <div key={index} className=''>
                  <label>{element}:</label>
                  <input
                    className="form-control mb-2"
                    name={element}
                    onChange={handleInputChange}
                    value={inputValues[element]}
                    autoFocus={element === "usuario" || element === "nombre"}
                  />
                </div>
              ))
            }



          </>

        }
      </Form>

      {/* <>
                        {
                          <>
                            {
                              action !== 'printerConfig' &&
                              <GenericModalForm {...modalFormProps} />
                            }
                            {
                              admin && action === 'printerConfig' &&
                              <div className="w-100 p-0">
                                <ToggleButton action={'isActive'} />
                                <hr className="w-100" />
                                <GenericModalForm {...modalFormProps} />
                              </div>
                            }
                            {
                              pathname === '/dashboard/usuarios' && (action === 'add' || action === 'edit') &&
                              <ToggleButton action={'uploadActivated'} />
                            }
                          </>
                        }
                      </> */}
    </>

  )

}
