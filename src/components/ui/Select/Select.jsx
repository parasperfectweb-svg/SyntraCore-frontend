// components/ui/Select/Select.jsx
export default function Select({
  label,
  size = 'sm',
  className = '',
  id,
  options = [],       // [{ value, label }] — or omit and pass <option> children instead
  children,
  ...rest
}) {
  const selectId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return (
    <div className="mb-2">
      {label && (
        <label htmlFor={selectId} className="form-label small text-muted mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`form-select ${size ? `form-select-${size}` : ''} ${className}`.trim()}
        {...rest}
      >
        {children ?? options.map((opt) => (
          <option key={opt.value ?? opt.label} value={opt.value ?? opt.label}>
            {opt.label ?? opt.value}
          </option>
        ))}
      </select>
    </div>
  );
}
