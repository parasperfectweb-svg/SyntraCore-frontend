// components/ui/Textarea/Textarea.jsx
export default function Textarea({
  label,
  size = 'sm',
  rows = 2,
  className = '',
  id,
  ...rest
}) {
  const areaId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
  return (
    <div className="mb-2">
      {label && (
        <label htmlFor={areaId} className="form-label small text-muted mb-1">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        rows={rows}
        className={`form-control ${size ? `form-control-${size}` : ''} ${className}`.trim()}
        {...rest}
      />
    </div>
  );
}
