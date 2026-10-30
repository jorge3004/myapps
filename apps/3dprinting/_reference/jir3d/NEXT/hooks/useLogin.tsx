import { setAuthError } from "@/store/slices/authSlice";
import { useForm } from "./useForm";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { formAuthentication } from "@/store/thunks/authThunk";

export const useLogin = () => {
    const dispatch = useAppDispatch();
    const { form, handleChange } = useForm();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        for (const [key, value] of Object.entries(form)) {
            if (value === "") {
                console.log(key, value)
                const authE = { [key]: "This field is required" }
                return dispatch(setAuthError(authE));
            }
        };
        dispatch(formAuthentication(form));
    }
    return { form, handleChange, handleSubmit };
}