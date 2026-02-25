declare module 'lucide-react' {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

  type LucideProps = SVGProps<SVGSVGElement> & {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  };
  type LucideIcon = ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;

  export const AlertTriangle: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Bot: LucideIcon;
  export const Calendar: LucideIcon;
  export const Check: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Clock: LucideIcon;
  export const Clock3: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Crown: LucideIcon;
  export const Database: LucideIcon;
  export const DollarSign: LucideIcon;
  export const Edit: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const FileText: LucideIcon;
  export const Filter: LucideIcon;
  export const FolderTree: LucideIcon;
  export const Home: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const Loader2: LucideIcon;
  export const Lock: LucideIcon;
  export const Menu: LucideIcon;
  export const MessageSquareText: LucideIcon;
  export const Mic: LucideIcon;
  export const Search: LucideIcon;
  export const SendHorizontal: LucideIcon;
  export const Shield: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Smartphone: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Star: LucideIcon;
  export const Trash2: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const UserRound: LucideIcon;
  export const Users: LucideIcon;
  export const Wallet: LucideIcon;
  export const X: LucideIcon;
}
