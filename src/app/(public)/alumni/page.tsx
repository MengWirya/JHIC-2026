import { SiteHeader } from "@/components/site-header";

export default function AlumniPage() {
  return <div className="native-page"><SiteHeader /><main className="native-alumni-page"><div className="native-shell"><p className="native-eyebrow native-eyebrow--dark">Alumni Moklet</p><h1>Jejaring yang terus tumbuh setelah lulus.</h1><div className="native-alumni-grid"><article className="native-alumni-panel"><h2>Alumni Hub</h2><p>Ruang untuk berbagi kabar, peluang, dan kolaborasi antara alumni dengan sekolah.</p></article><article className="native-alumni-panel"><h2>Terhubung kembali</h2><p>Hubungi sekolah untuk memperbarui data alumni atau menginisiasi kolaborasi.</p></article></div></div></main></div>;
}