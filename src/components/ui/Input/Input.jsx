// components/ui/Input/Input.jsx
// Label + form-control pair, matching the compact field pattern used
// throughout the Quotes page (small label above a Bootstrap input).

export default function Input({
  label,
  size = 'sm',
  className = '',
  id,
  ...rest
}) {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return (
    <div className="mb-2">
      {label && (
        <label htmlFor={inputId} className="form-label small text-muted mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`form-control ${size ? `form-control-${size}` : ''} ${className}`.trim()}
        {...rest}
      />
    </div>
  );
}
