import { type } from "os";
import { useState } from "react";


export interface Form {
    userName: string;
    password: string;
}
const temForm: Form = {
    userName: "",
    password: "",
}

export const useForm = (initialState: Form = temForm) => {

    const [form, setForm] = useState<Form>(initialState);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const resetForm = () => {
        setForm(initialState);
    };

    return { form, handleChange, resetForm };
}