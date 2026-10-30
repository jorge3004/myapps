import React from "react";

export const ImageModal = ({ id, thumbnail, name, mode = "div" }) => {
  const modalContent = (
    <div className="modal-dialog" role="document" id="imageModal">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className=" w-100 text-center" id="things-modal-title">
            {name}
          </h5>
          <div className="d-flex flex-row-reverse flex-grow-1 ">
            <button
              type="button"
              className="close btn btn-danger "
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
        <div className="modal-body">
          <img className="rounded" src={thumbnail} alt="img" />
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-danger"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <>
      {/* Example 1 */}
      {/* <td>
        <div
          className="block-icon"
          data-bs-toggle="modal"
          data-bs-target={`#_${id}`}
        >
          <img src={src} alt="img" className="rounded" />
          <MdIcons.MdZoomOutMap className="icon-tag" />
        </div>
      </td>
      <ImageModal id={id} thumbnail={src} name={id} mode="td" /> */}

      {/* Example 2 */}
      {/* <td>
        <div
          className="block-icon"
          data-bs-toggle="modal"
          data-bs-target={`#_${id}`}
        >
          <img src={src} alt="img" className="rounded" />
          <MdIcons.MdZoomOutMap className="icon-tag" />
        </div>
      </td>
      <ImageModal id={id} thumbnail={src} name={id} mode="td" /> */}

      {mode === "div" ? (
        <div
          className="modal fade"
          id={`_${id}`}
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          {modalContent}
        </div>
      ) : (
        <td
          className={`modal fade ${id}  `}
          id={`_${id}`}
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          {modalContent}
        </td>
      )}
    </>
  );
};
