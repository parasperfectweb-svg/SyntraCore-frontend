// components/ui/Card/Card.jsx
// Bootstrap card wrapper. Pass `title` for the standard card-header row,
// or omit it and just use `children` for a plain card body.

export default function Card({
  title,
  subtitle,
  headerAction,
  className = '',
  bodyClassName = '',
  children,
  ...rest
}) {
  return (
    <div className={`card shadow-sm ${className}`.trim()} {...rest}>
      {(title || headerAction) && (
        <div className="card-header bg-white d-flex align-items-center justify-content-between py-3">
          <div>
            {title && <h2 className="h6 fw-bold mb-0">{title}</h2>}
            {subtitle && <small className="text-muted">{subtitle}</small>}
          </div>
          {headerAction}
        </div>
      )}
      <div className={`card-body ${bodyClassName}`.trim()}>{children}</div>
    </div>
  );
}
