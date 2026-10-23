
import { useEffect, useState } from 'react';
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

/**
 * Initialise toutes les rubriques ayant des enfants comme ouvertes.
 * Fonctionne également pour les sous-menus imbriqués.
 */
function getAllOpenMenus(
  items: MenuItem[],
  level = 0,
): Record<string, boolean> {
  const result: Record<string, boolean> = {};

  items.forEach((item) => {
    if (item.children?.length) {
      const key = getMenuKey(item, level);

      result[key] = true;

      Object.assign(
        result,
        getAllOpenMenus(item.children, level + 1),
      );
    }
  });

  return result;
}

export function SidebarMenu() {
  const { pathname } = useLocation();

  // Toutes les rubriques sont ouvertes dès le premier affichage.
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(
    () => getAllOpenMenus(MENU_SIDEBAR as MenuItem[]),
  );

  // Garde ouvertes les rubriques contenant la page active.
  useEffect(() => {
    const activeMenus: Record<string, boolean> = {};

    const visit = (items: MenuItem[], level = 0) => {
      items.forEach((item) => {
        if (item.children?.length) {
          const key = getMenuKey(item, level);

          if (hasActiveDescendant(item, pathname)) {
            activeMenus[key] = true;
          }

          visit(item.children, level + 1);
        }
      });
    };

    visit(MENU_SIDEBAR as MenuItem[]);

    setOpenMenus((previous) => ({
      ...previous,
      ...activeMenus,
    }));
  }, [pathname]);

  const toggleMenu = (key: string) => {
    setOpenMenus((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  return (
    <nav
      aria-label="Navigation principale"
      className="w-full min-w-0 bg-[#556B2F] px-2 py-3 text-white sm:px-3"
    >
      <div className="flex w-full min-w-0 flex-col gap-1">
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
    return <div className="my-2 border-t border-white/20" />;
  }

  if (!item.title || item.disabled) {
    return null;
  }

  const hasChildren = Array.isArray(item.children);
  const key = getMenuKey(item, level);
  const isOpen = Boolean(openMenus[key]);
  const isActive = isPathActive(pathname, item.path);
  const hasActiveChild = hasActiveDescendant(item, pathname);

  const Icon = item.icon;

  const baseClass =
    'flex min-h-11 w-full min-w-0 items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70';

  const activeClass = 'bg-[#6B833F] text-white shadow-sm';

  const inactiveClass =
    'text-white/90 hover:bg-[#647A3A]/70 hover:text-white';

  const indentStyle = {
    paddingInlineStart: `${12 + Math.min(level, 4) * 12}px`,
  };

  const label = (
    <span className="min-w-0 flex-1 truncate">{item.title}</span>
  );

  const badge = item.badge ? (
    <span className="shrink-0 rounded bg-white/20 px-2 py-0.5 text-xs text-white">
      {item.badge}
    </span>
  ) : null;

  const content = (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-3">
        {Icon && <Icon className="size-5 shrink-0" />}
        {label}
      </span>

      {badge}
    </>
  );

  if (hasChildren) {
    return (
      <div className="w-full min-w-0">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => onToggle(key)}
          className={`${baseClass} justify-between ${
            isActive || hasActiveChild || isOpen
              ? activeClass
              : inactiveClass
          }`}
          style={indentStyle}
        >
          {content}

          <ChevronDown
            aria-hidden="true"
            className={`size-4 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="mt-1 flex w-full min-w-0 flex-col gap-1">
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

  return (
    <div
      className={`${baseClass} ${inactiveClass}`}
      style={indentStyle}
    >
      {content}
    </div>
  );
}
