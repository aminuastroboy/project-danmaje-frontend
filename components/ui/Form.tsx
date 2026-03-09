type InputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
};

export function TextInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: InputProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        className="input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </label>
  );
}

type SelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange?: (value: string) => void;
};

export function SelectInput({ label, value, options, onChange }: SelectProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select className="input" value={value} onChange={(e) => onChange?.(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function PrimaryButton({
  children,
  onClick,
  full = true,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  full?: boolean;
}) {
  return (
    <button className={`primary-button ${full ? "full" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}
