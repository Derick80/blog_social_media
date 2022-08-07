import { useState } from 'react'

export interface FormFieldProps {
    htmlFor: string
    label: string
    type?: string
    value?: any
    name?: string
    onChange?: (...args: any) => any
    onClick?: (...args: any) => any
    checked?: boolean
    error?: string
    className?: string
    labelClass?: string
    defaultValue?: string | boolean
}

export default function FormField({
                                      htmlFor,
                                      label,
                                      type,
                                      value,
                                      checked,
                                      onClick = () => {
                                      },
                                      onChange = () => {
                                      },
                                      error = '',
                                      className,
                                      labelClass
                                  }: FormFieldProps) {
    const [errorText, setErrorText] = useState(error)

    return (
        <>
            <label htmlFor={ htmlFor } className={ labelClass }>
                { label }
            </label>
            <input
                className={ `${ className } dark:text-black w-full p-2 rounded-xl my-2` }
                onChange={ (event) => {
                    onChange(event)
                    setErrorText('')
                } }
                type={ type }
                checked={ checked }
                id={ htmlFor }
                name={ htmlFor }
                value={ value }
            />
            <div>{ errorText || '' }</div>
        </>
    )
}
