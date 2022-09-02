export interface MultiComboProps {
    clearable?: boolean;
    onChange:(value:ComboBoxOption[])=>void;
    options:ComboBoxOption[];
    value:ComboBoxOption[];
    status?: StatusVariant;
    comboType?:"primar | secondary";
    selectedOptionsTextOverride?:string;
    filterOption?: (inputValue: string, option: ComboBoxOption) => boolean;
    label:string;
    placeholder?:string;
    disabled?:boolean;
}

export default function MultiCombox({clearable, onChange, options, value, status, comboType, selectedOptionsTextOverride,filterOption,label,placeholder,disabled}: MultiComboProps) {


    return(
        <div>
            <input
                clearable={clearable}
                onChange={onChange}
                options={options}
                value={value}
                status={status}
                comboType={comboType}
                selectedOptionsTextOverride={selectedOptionsTextOverride}
                filterOption={filterOption}
                label={label}
                placeholder={placeholder}
                disabled={disabled}
                />
            ComboBox
        </div>
    )
}