import React from 'react'

export const useFormAddFileModal = () => {
    const [inputChange, setinputChage] = useState({ text: desc || "", file: null })
    const [error, setError] = useState("")
    const fileOnChange = ({ target }) => {
        const file = target.files[0]
        setinputChage({ ...inputChange, file })
    }
    const textOnChange = ({ target }) => {
        setinputChage({ ...inputChange, text: target.value })
    }

    return {}
}
