interface props {
  options: {
    id: string
    name: string
    label: string
  }[]
  className?: string
  containerClassName?: string
  defaultValue?: any
  id?: string
  name?: string
  label?: string
  value?: {
    id: string
    name: string
    label: string
  }[]
  children?: React.ReactNode

  onChange?: (...args: any) => any
  multiple?: boolean
}

export function SelectBox({
  options = [],
  onChange = () => {},
  className = '',
  containerClassName = '',
  defaultValue = '',
  name,
  id,
  value =[],
  label,
  multiple,
  children,
}: props) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div className={`flex items-center ${containerClassName} my-2`}>
        <select
          className={`${className} form-field-primary`}
          defaultValue={defaultValue}
          id={id}
          name={name}
          onChange={onChange}
          value={value.map((v) => v.name)}
          multiple={multiple}
        >
          {children}

        </select>
        <svg
          className="pointer-events-none -ml-7 mt-1 h-4 w-4 fill-current text-gray-400"
          viewBox="0 0 140 140"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z" />
          </g>
        </svg>
      </div>
    </div>
  )
}
