import React from 'react';

export const GenericModalError = (props) => {
    const { error } = props
    return (
        <div className="text-center">
            <label className="text-danger text-uppercase ">
                {error}
            </label>
        </div>
    )
}
