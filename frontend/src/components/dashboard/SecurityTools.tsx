import Link from "next/link";
import { ArrowRight, FileCheck, Lock, MessageSquare, Server } from "lucide-react";

const tools = [
  { href: "/messages", title: "Email & SMS Scanner", description: "Detect social engineering, scams, and urgent lures.", action: "Inspect message", icon: MessageSquare },
  { href: "/password", title: "Password Security", description: "Check if credentials have appeared in data breaches.", action: "Check breach", icon: Lock },
  { href: "/ip-domain", title: "Domain Intelligence", description: "Review ownership, reputation, and network signals.", action: "Inspect domain", icon: Server },
  { href: "/file-security", title: "File Scanner", description: "Inspect files and hashes for malicious signatures.", action: "Audit file", icon: FileCheck },
];

export function SecurityTools() {
  return <section className="space-y-3"><div><h2 className="section-title">Security tools</h2><p className="section-description">Focused checks for the threats you encounter every day.</p></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{tools.map(({ href, title, description, action, icon: Icon }) => <Link key={href} href={href} className="tool-card group"><div><div className="icon-tile"><Icon className="h-4 w-4" /></div><h3 className="mt-3 text-sm font-medium text-foreground">{title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p></div><span className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-primary transition-transform group-hover:translate-x-0.5">{action}<ArrowRight className="h-3.5 w-3.5" /></span></Link>)}</div></section>;
}
