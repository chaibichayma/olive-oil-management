
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';
import { SidebarHeader } from './sidebar-header';
import { SidebarMenu } from './sidebar-menu';

export function Sidebar() {
  const { settings } = useSettings();
  const { pathname } = useLocation();

  const isDark =
    settings.layouts.demo1.sidebarTheme === 'dark' ||
    pathname.includes('dark-sidebar');

  return (
    <aside
      aria-label="Navigation principale"
      className={cn(
        'sidebar shrink-0 flex-col items-stretch',
        'bg-[#FAFBF8] text-slate-700',
        'hidden lg:fixed lg:inset-y-0 lg:start-0 lg:z-20 lg:flex',
        'w-(--sidebar-default-width) overflow-hidden',
        'border-e border-[#E5E9DF]',
        isDark && 'dark',
      )}
    >
      <div className="w-full shrink-0 border-b border-[#E5E9DF] bg-white">
        <SidebarHeader />
      </div>

      <div className="min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto">
        <div className="w-full min-w-0">
          <SidebarMenu />
        </div>
      </div>
    </aside>
  );
}
