import Pagination from './Pagination';
import { Empty, ErrorBox, Loader } from './Feedback';

/** columns: [{header, render(row)}] ; paged: result of usePaged() */
export default function PagedTable({ paged, columns, empty = 'Nothing to show' }) {
  const { data, loading, error, page, setPage, reload } = paged;
  if (loading && !data) return <Loader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  return (
    <>
      {loading && <div className="bar-loading" />}
      {!data.content.length ? <Empty text={empty} /> : (
        <div className="table-wrap">
          <table>
            <thead><tr>{columns.map((c) => <th key={c.header}>{c.header}</th>)}</tr></thead>
            <tbody>{data.content.map((r, i) => <tr key={r.id || i}>{columns.map((c) => <td key={c.header}>{c.render(r)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
      <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
    </>
  );
}
