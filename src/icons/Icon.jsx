import {
  Map, List, ChevronRight, Check, X, Camera, Wifi, WifiOff,
  AlertTriangle, User, MapPin, Clock, Download, Pencil, Plus,
  PenLine, Star, Info, Layers, Flag, Globe, Building, ClipboardList,
  Calendar, Phone, Mail, Shield, Zap, Eye, FileText, Upload, Trash2,
  Home, Settings, LayoutDashboard, Moon, Sun,
} from "lucide-react";

const ICON_MAP = {
  map: Map,
  list: List,
  chevR: ChevronRight,
  "chevron-right": ChevronRight,
  check: Check,
  x: X,
  camera: Camera,
  wifi: Wifi,
  wifiOff: WifiOff,
  alert: AlertTriangle,
  user: User,
  nav: MapPin,
  clock: Clock,
  download: Download,
  pen: Pencil,
  plus: Plus,
  sig: PenLine,
  star: Star,
  info: Info,
  layers: Layers,
  flag: Flag,
  globe: Globe,
  building: Building,
  clipboard: ClipboardList,
  calendar: Calendar,
  phone: Phone,
  mail: Mail,
  shield: Shield,
  zap: Zap,
  eye: Eye,
  file: FileText,
  upload: Upload,
  trash: Trash2,
  home: Home,
  settings: Settings,
  dashboard: LayoutDashboard,
  moon: Moon,
  sun: Sun,
};

export const Icon = ({ n, size = 18, color = "currentColor", style: s, className }) => {
  const LucideIcon = ICON_MAP[n];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} color={color} style={s} className={className} strokeWidth={1.8} />;
};
