import type { SVGProps } from "react";

/**
 * Lightweight, dependency-free icon set (outline style, 24×24).
 * All icons inherit `currentColor`, so color via Tailwind text utilities.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Svg(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

export const ChartLineIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 3v18h18" />
    <path d="M7 14l3-4 3 2 5-7" />
  </Svg>
);

export const ChartPieIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3a9 9 0 1 0 9 9h-9z" />
    <path d="M12 3v9h9" opacity={0.5} />
  </Svg>
);

export const GridIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Svg>
);

export const ChartBarIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 21h18" />
    <rect x="5" y="11" width="3.5" height="7" rx="1" />
    <rect x="10.5" y="6" width="3.5" height="12" rx="1" />
    <rect x="16" y="13" width="3.5" height="5" rx="1" />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const PencilIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20h4l10.5-10.5a2.12 2.12 0 0 0-3-3L5 17v3z" />
    <path d="M13.5 6.5l3 3" />
  </Svg>
);

export const TrashIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
  </Svg>
);

export const LogoutIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </Svg>
);

export const ArrowUpIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </Svg>
);

export const ArrowDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </Svg>
);

export const ChevronUpIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 15l6-6 6 6" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 6L9 17l-5-5" />
  </Svg>
);

export const XIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

export const EyeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

export const EyeOffIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 3l18 18" />
    <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.2 4.2M6.6 6.6A18 18 0 0 0 2 12s3.5 7 10 7a10.9 10.9 0 0 0 4-0.8" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </Svg>
);

export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M4 7l8 6 8-6" />
  </Svg>
);

export const LockIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4.5" y="11" width="15" height="9" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);

export const AtIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.9 7.9" />
  </Svg>
);

export const WalletIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2" />
    <rect x="3" y="7" width="18" height="12" rx="2.5" />
    <path d="M16 12.5h2.5" />
  </Svg>
);

export const BriefcaseIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12h18" />
  </Svg>
);

export const BookIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" />
    <path d="M5 17a3 3 0 0 1 3-3h11" />
  </Svg>
);

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const StarIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 19.6l1-6L3.3 9.4l6-.9L12 3z" />
  </Svg>
);

export const TrendingUpIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M17 7h4v4" />
  </Svg>
);

export const SparklesIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4z" />
    <path d="M19 14l.7 1.9L21.5 16.6 19.7 17.3 19 19.2 18.3 17.3 16.5 16.6 18.3 15.9 19 14z" />
  </Svg>
);

export const InfoIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Svg>
);

export const AlertTriangleIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4l9 16H3l9-16z" />
    <path d="M12 10v4M12 17h.01" />
  </Svg>
);

export const CheckCircleIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.5 2.5 4.5-5" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20a8 8 0 0 1 16 0" />
  </Svg>
);

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 11l9-7 9 7" />
    <path d="M5 10v10h14V10" />
  </Svg>
);

export const DragIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="6" r="1" />
    <circle cx="15" cy="6" r="1" />
    <circle cx="9" cy="12" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="9" cy="18" r="1" />
    <circle cx="15" cy="18" r="1" />
  </Svg>
);

export const ActivityIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12h4l3 8 4-16 3 8h4" />
  </Svg>
);

export const RefreshIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <path d="M21 3v6h-6" />
  </Svg>
);
