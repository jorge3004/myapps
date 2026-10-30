import { FormControlLabel, FormGroup } from '@mui/material';
import Switch from '@mui/material/Switch';
import React from 'react';

export const GenericSwitches = (props) => {
    const { switchLabel, handleSwitchChange, switchName, switchValues } = props
    return (
        <div className="d-flex justify-content-center">
            <FormGroup >
                <FormControlLabel
                    control={
                        <Switch
                            size="small"
                            name={switchName}
                            onChange={handleSwitchChange}
                            checked={switchValues[switchName]}
                        // defaultChecked={inputValues[switchName]}
                        />
                    }
                    label={switchLabel}
                />
            </FormGroup>
        </div>

    )
}
