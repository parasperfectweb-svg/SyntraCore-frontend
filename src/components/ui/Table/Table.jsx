// components/ui/Table/Table.jsx
// Wraps Bootstrap's table classes so every data table in the app looks
// consistent. Pass `columns` (array of {key, label, align}) and `rows`
// (array of plain objects) for the simple case, or just use `children`
// to hand-write thead/tbody when a row needs custom markup (badges,
// icons, checkboxes — as House Jobs does).

export default function Table({ columns, rows, renderRow, hover = true, className = '', children }) {
  const classes = ['table', 'align-middle', hover ? 'table-hover' : '', className]
    .filter(Boolean).join(' ');

  if (children) {
    return (
      <div className="table-responsive">
        <table className={classes}>{children}</table>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className={classes}>
        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`small ${col.align === 'end' ? 'text-end' : ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((col) => (
                <td key={col.key} className={col.align === 'end' ? 'text-end' : ''}>
                  {renderRow ? renderRow(row, col) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
