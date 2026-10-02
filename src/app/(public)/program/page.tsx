import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const programs = [
  ["Rekayasa Perangkat Lunak", "Membangun aplikasi web, mobile, dan produk digital dengan standar industri."],
  ["Teknik Komputer dan Jaringan", "Merancang jaringan, cloud computing, keamanan siber, dan infrastruktur digital."],
  ["Pengembangan Gim", "Mengembangkan gim dari ide, desain, pemrograman, hingga siap dimainkan."],
];

export default function ProgramPage() {
  return <div className="native-page"><SiteHeader /><main className="native-program-page"><div className="native-shell"><p className="native-eyebrow native-eyebrow--dark">Program keahlian</p><h1>Temukan bidang yang ingin kamu bangun.</h1><div className="native-program-grid--page">{programs.map(([title, text]) => <article className="native-program-panel" key={title}><h2>{title}</h2><p>{text}</p><Link className="native-text-link native-text-link--dark" href="/kontak">Tanya lebih lanjut</Link></article>)}</div></div></main></div>;
}