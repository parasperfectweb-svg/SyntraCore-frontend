// components/ui/Button/Button.jsx
// Thin wrapper around Bootstrap's button classes — every button in the
// app should go through here so variant/size naming stays consistent.

const VARIANT_CLASS = {
  primary: 'btn-primary',
  secondary: 'btn-outline-secondary',
  outlinePrimary: 'btn-outline-primary',
  light: 'btn-light',
  danger: 'btn-danger',
};

export default function Button({
  variant = 'primary',
  size,           // 'sm' | 'lg' | undefined
  block = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    VARIANT_CLASS[variant] ?? VARIANT_CLASS.primary,
    size ? `btn-${size}` : '',
    block ? 'w-100' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
