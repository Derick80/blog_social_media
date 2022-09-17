import { useEffect, useState } from "react";

export interface FormFieldProps {
  htmlFor: string;
  label: string;
  type?: string;
  value: any;
  name?: string;
  onChange: (...args: unknown[]) => void;
  onClick?: (...args: any) => unknown;
  checked?: boolean;
  error?: string;
  className?: string;
  labelClass?: string;
  defaultValue?: string | boolean;
  autocomplete?: string;
}

export default function FormField({
  htmlFor,
  label,
  type,
  value,
  className,
  checked,
  onClick = () => {},
  onChange = () => {},
  error = "",
  labelClass,
  autocomplete,
}: FormFieldProps) {
  const [errorText, setErrorText] = useState(error);
  useEffect(() => {
    setErrorText(error);
  }, [error]);
  return (
    <>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      <input
        className={className}
        onChange={(event) => {
          onChange(event);
          setErrorText('')
        }}
        type={type}
        checked={checked}
        id={htmlFor}
        name={htmlFor}
        value={value}
        autoComplete={autocomplete}
      />
      <div>{errorText || ""}</div>
    </>
  );
}
