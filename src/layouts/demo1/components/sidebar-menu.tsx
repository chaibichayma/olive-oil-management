
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { MENU_SIDEBAR } from '@/config/menu.config';
import type { LucideIcon } from 'lucide-react';

interface MenuItem {
  title?: string;
  icon?: LucideIcon;
  path?: string;
  children?: MenuItem[];
  disabled?: boolean;
  badge?: string;
  separator?: boolean;
}

interface SidebarMenuItemProps {
  item: MenuItem;
  pathname: string;
  openMenus: Record<string, boolean>;
  onToggle: (key: string) => void;
  level?: number;
}

function isPathActive(pathname: string, path?: string): boolean {
  if (!path || path === '#') {
    return false;
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

function hasActiveDescendant(
  item: MenuItem,
  pathname: string,
): boolean {
  return Boolean(
    item.children?.some(
      (child) =>
        isPathActive(pathname, child.path) ||
        hasActiveDescendant(child, pathname),
    ),
  );
}

function getMenuKey(item: MenuItem, level: number): string {
  return `${level}:${item.path ?? item.title ?? 'menu'}`;
}

export function SidebarMenu() {
  const { pathname } = useLocation();

  // Tous les menus parents sont fermés au chargement.
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (key: string) => {
    setOpenMenus((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  return (
    <nav
      aria-label="Navigation principale"
      className="w-full min-w-0 bg-[#FAFBF8] px-2 py-3 text-slate-700 sm:px-3"
    >
      <div className="flex w-full min-w-0 flex-col gap-1.5">
        {(MENU_SIDEBAR as MenuItem[]).map((item, index) => (
          <SidebarMenuItem
            key={`${item.path ?? item.title ?? 'menu'}-${index}`}
            item={item}
            pathname={pathname}
            openMenus={openMenus}
            onToggle={toggleMenu}
          />
        ))}
      </div>
    </nav>
  );
}

function SidebarMenuItem({
  item,
  pathname,
  openMenus,
  onToggle,
  level = 0,
}: SidebarMenuItemProps) {
  if (item.separator) {
    return <div className="my-2 border-t border-slate-200" />;
  }

  if (!item.title || item.disabled) {
    return null;
  }

  const hasChildren = Boolean(item.children?.length);
  const key = getMenuKey(item, level);
  const isOpen = Boolean(openMenus[key]);
  const isActive = isPathActive(pathname, item.path);
  const hasActiveChild = hasActiveDescendant(item, pathname);

  const Icon = item.icon;

  const baseClass =
    'flex min-h-11 w-full min-w-0 items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#556B2F]/40';

  const parentClass = isOpen
    ? 'bg-[#EEF1E8] text-[#405321] shadow-sm'
    : 'bg-white text-slate-700 hover:bg-[#F0F2EC]';

  const activeClass =
    'bg-[#E8EDDF] text-[#405321] font-semibold';

  const inactiveClass =
    'bg-transparent text-slate-600 hover:bg-[#F0F2EC] hover:text-[#405321]';

  const indentStyle = {
    paddingInlineStart: `${12 + Math.min(level, 4) * 12}px`,
  };

  const label = (
    <span className="min-w-0 flex-1 truncate">{item.title}</span>
  );

  const badge = item.badge ? (
    <span className="shrink-0 rounded-md bg-[#E8EDDF] px-2 py-0.5 text-xs font-medium text-[#405321]">
      {item.badge}
    </span>
  ) : null;

  const content = (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-3">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="size-5 shrink-0 text-[#556B2F]"
          />
        )}
        {label}
      </span>

      {badge}
    </>
  );

  // Rubriques parentes avec sous-menus.
  if (hasChildren) {
    return (
      <div className="w-full min-w-0">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => onToggle(key)}
          className={`${baseClass} justify-between ${parentClass} ${
            hasActiveChild ? 'border-s border-[#556B2F]' : ''
          }`}
          style={indentStyle}
        >
          {content}

          <ChevronDown
            aria-hidden="true"
            className={`size-4 shrink-0 text-slate-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="mt-1 flex w-full min-w-0 flex-col gap-1 border-s border-[#E1E6D9] ms-3 ps-1">
            {item.children!.map((child, index) => (
              <SidebarMenuItem
                key={`${child.path ?? child.title ?? 'submenu'}-${index}`}
                item={child}
                pathname={pathname}
                openMenus={openMenus}
                onToggle={onToggle}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Liens de navigation.
  if (item.path && item.path !== '#') {
    return (
      <NavLink
        to={item.path}
        end
        aria-current={isActive ? 'page' : undefined}
        className={`${baseClass} ${
          isActive ? activeClass : inactiveClass
        }`}
        style={indentStyle}
      >
        {content}
      </NavLink>
    );
  }

  // Élément sans route.
  return (
    <div
      className={`${baseClass} ${inactiveClass}`}
      style={indentStyle}
    >
      {content}
    </div>
  );
}
