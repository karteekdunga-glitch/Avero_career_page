export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-600">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="font-semibold text-gray-800">Avero Advisors</div>
            <div>We don’t just consult, we advise, we guide, we deliver.</div>
            <div>Public-sector focused.</div>
          </div>
          <ul className="space-y-1">
            <li><a href="https://averoadvisors.com/who-we-are/" target="_blank" rel="noreferrer">Who We Are</a></li>
            <li><a href="https://averoadvisors.com/contact-us/" target="_blank" rel="noreferrer">Contact Us</a></li>
            <li><a href="https://averoadvisors.com/" target="_blank" rel="noreferrer">Website</a></li>
          </ul>
        </div>
        <div className="mt-6">© {new Date().getFullYear()} Avero Advisors</div>
      </div>
    </footer>
  )
}
