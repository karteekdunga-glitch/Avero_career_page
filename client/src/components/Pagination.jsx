export default function Pagination({ page, limit, total, onPage }) {
  const pages = Math.ceil(total / limit)
  if (pages <= 1) return null
  return (
    <div className="flex gap-2 items-center">
      <button disabled={page<=1} onClick={() => onPage(page-1)} className="btn">Prev</button>
      <div>Page {page} of {pages}</div>
      <button disabled={page>=pages} onClick={() => onPage(page+1)} className="btn">Next</button>
    </div>
  )
}
