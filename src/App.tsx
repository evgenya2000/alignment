import React, { useEffect, useState } from 'react';
import css from "./App.module.scss";
import { useForm } from "react-hook-form";
import Input from './components/Input';
import { Button, Typography } from '@mui/material';
import ViewAlignment from './components/ViewAlignment';

function App() {
  const { formState: { isValid }, control, handleSubmit, watch } = useForm(
    {
      mode: "onTouched", defaultValues: { // Add this
        subsequence_1: "MGKKGYKRNEYNNPFQQAWANPKHAWAQVNGETRLTQNLIILERETRKRS-",
        subsequence_2: "MSTK-DQLDPQSQAFHHNWTRPKHASSQVNGHTEMSQHNIILRRVPRSGRR",
      }
    }
  );

  const [field1, field2] = watch(["subsequence_1", "subsequence_2"]);
  const [errorLength, setErrorLength] = useState(false);
  const [result, setResult] = useState({ result1: "", result2: "" });

  useEffect(() => {
    if (field1 && field2 && field1?.length !== field2?.length) {
      setErrorLength(true);
    } else {
      setErrorLength(false);
    }
  }, [field1, field2]);

  const onSubmit = (data: any) => {
    setResult({ result1: data.subsequence_1, result2: data.subsequence_2 });
  };

  return (
    <div className={css.root}>
      <Typography variant="h5">Enter sequences</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input name="subsequence_1" control={control} label="Subsequence 1" />
        <Input name="subsequence_2" control={control} label="Subsequence 2" />
        {errorLength && <Typography variant="body2" color="error">The length of the field must match</Typography>}
        <Button type="submit" variant="contained" disabled={errorLength || !isValid}>Align</Button>
      </form>
      {result.result1 && result.result2 &&
        <ViewAlignment subFirst={result.result1} subSecond={result.result2} />
      }
    </div>
  );
}

export default App;
