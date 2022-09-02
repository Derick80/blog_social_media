//something is not working here but I can get a basic non reusuable component to work


interface props {
  options: Array<{
name: string;
    value: string;
    }>;

  className?: string;
  containerClassName?: string;
  id?: string;
  name?: string;
  label?: string;
  value?: any;
  onChange: (...args: any) => any;
  multiple: boolean;
}

export function SelectBox({
  options = [],
  onChange = () => {},
  className = "",
  containerClassName = "",
  name,
  id,
  value,
  label,
    multiple,
}: props) {

  return (
    <div>
      <label htmlFor={id} className="text-blue-600 font-semibold">
        {label}
      </label>
      <div className={`flex items-center ${containerClassName} my-2`}>
        <select
          className={`text-black dark:text-white dark:bg-gray-400`}
          id={id}
          name={name}
          onChange={onChange}
          value={value || []}
            multiple={multiple}
        >
          {options.map((option) => (
            <option key={option.value} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>

      </div>
    </div>
  );
}
