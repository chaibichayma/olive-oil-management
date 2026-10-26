
import { ChevronFirst } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';

export function SidebarHeader() {
  const { settings, storeOption } = useSettings();

  const handleToggleClick = () => {
    storeOption(
      'layouts.demo1.sidebarCollapse',
      !settings.layouts.demo1.sidebarCollapse,
    );
  };

  return (
   <div className="sidebar-header hidden lg:flex items-center justify-center relative px-3 lg:px-6 mt-[6px] mb-[30px] shrink-0">
  <Link to="/" className="flex w-full items-center justify-center min-w-0">
    <img
      src="/media/app/oliva_logo.png"
      className="default-logo h-[70px] w-[160px] max-w-none object-contain translate-y-[20px]"
      alt="Logo de mon application"
    />
  </Link>
</div>
  );
}
