import { TextField, Typography } from "@mui/material";
import { useController } from "react-hook-form";
import css from "./Input.module.scss";

interface InputProps {
    name: string,
    control: any,
    label: string
}

function Input({ name, control, label }: InputProps) {
    const { field, fieldState: { error } } = useController({
        name,
        control,
        rules: {
            required:
                { value: true, message: "This field is required" },
            pattern: {
                value: /^[ARNDCEQGHILKMFPSTWYV-]+$/,
                message: "Sequences can only contain Latin amino acid letters (A, R, N, D, C, E, Q, G, H, I, L, K, M, F, P, S, T, W, Y, V) and the symbol -",
            },
        },
    });

    return (
        <div className={css.root}>
            <TextField
                {...field}
                id="outlined-secondary"
                label={label}
                variant="outlined"
                color="secondary"
                className={css.rootField}
            />
            {error && <Typography variant="body2" color="error">{error.message}</Typography>}
        </div>
    );
}

export default Input;