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

  defaultValue?: string[]
  label: string

  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function MultipleSelect({
  options,
  value,
  multiple,
  className,
  label,
  name,
  onChange,
  defaultValue,
}: MultiSelectProps) {
  return (
    <div className="mx-1 mt-2 mb-2 flex items-baseline space-x-2 md:mt-4">
      <label htmlFor={label}>{label}</label>
      <select
        className={`${className}`}
        multiple={multiple}
        name={name}
        value={value}
        onChange={onChange}
      >
        {options?.map((opt) => {
          return (
            <option className="" key={opt.id} value={opt.value}>
              {opt.name}
            </option>
          )
        })}
      </select>
    </div>
  )
}
