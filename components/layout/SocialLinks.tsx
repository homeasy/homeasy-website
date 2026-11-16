import { site } from "@/lib/site";
import { FacebookIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from "@/components/icons/brand-icons";

const items = [
  { href: site.social.linkedin, label: "Homeasy on LinkedIn", Icon: LinkedInIcon },
  { href: site.social.instagram, label: "Homeasy on Instagram", Icon: InstagramIcon },
  { href: site.social.facebook, label: "Homeasy on Facebook", Icon: FacebookIcon },
  { href: site.social.youtube, label: "Homeasy on YouTube", Icon: YouTubeIcon },
];

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {items.map(({ href, label, Icon }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="inline-flex size-11 items-center justify-center rounded-button text-current opacity-90 hover:opacity-100"
          >
            <Icon size={20} />
          </a>
        </li>
      ))}
    </ul>
  );
}
