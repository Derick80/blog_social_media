import { Children } from 'react'

interface MultiSelectProps {
options: [
    {
        id: string
        value: string
        name: string
    }
]
multiple: boolean
className: string
name: string
value: string[]

defaultValue: string[]
label: string

onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
children: React.ReactNode
}


export default function MultipleSelect({options, value,multiple, className, label, name,onChange, defaultValue, children}:MultiSelectProps) {


    return(
        <>
         <label htmlFor={label}>{label}</label>
        <select
        className={`${className} form-field-primary`}
multiple={multiple}
name={name}
defaultValue={defaultValue}
value={value}
onChange={onChange}
>
{options?.map((opt) =>{
    return(
        <option
        key={opt.id}
        value={opt.value}>
            {opt.name}
        </option>
    )
})}
</select>

        </>
    )
}