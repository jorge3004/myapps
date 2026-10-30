import React from "react";

// { loading && <p className="animate__animated animate__flash text-center">Cargando...</p> }

export const Loading = ({ msg = "cargando..." }) => {
  return (
    <div className="text-center">
      <div className="spinner-border text-muted m-0 p-0" role="status"></div>
      {msg && (
        <p className="animate__animated animate__flash text-center mt-2 text-muted">
          {msg}
        </p>
      )}
    </div>
  );
};
