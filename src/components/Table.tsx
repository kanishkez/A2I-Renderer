
import type { A2UITableComponent } from "../types/a2ui";

export function Table({ component }: { component: A2UITableComponent }) {
  const { columns, rows } = component;

  return (
    <div className="a2ui-table-container">
      <table className="a2ui-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={{ textAlign: col.align || "left" }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col, j) => (
                <td key={j} style={{ textAlign: col.align || "left" }}>
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
