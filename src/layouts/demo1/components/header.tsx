
import { useEffect, useState } from 'react';
import { Bell, ChevronDown, Menu, Search } from 'lucide-react';
import { useLocation } from 'react-router';
import { useIsMobile } from '@/hooks/use-mobile';
import { SearchDialog } from '@/partials/dialogs/search/search-dialog';
import { NotificationsSheet } from '@/partials/topbar/notifications-sheet';
import { UserDropdownMenu } from '@/partials/topbar/user-dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Container } from '@/components/common/container';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { SidebarMenu } from './sidebar-menu';

export function Header() {
  const [isSidebarSheetOpen, setIsSidebarSheetOpen] = useState(false);

  const { pathname } = useLocation();
  const mobileMode = useIsMobile();

  const scrollPosition = useScrollPosition();
  const headerSticky = scrollPosition > 0;

  useEffect(() => {
    setIsSidebarSheetOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'header fixed top-0 start-0 end-0 z-10 flex h-16 shrink-0 items-center border-b border-border bg-white',
        headerSticky && 'shadow-sm',
      )}
    >
      <Container className="flex h-full items-center justify-between">
        {/* Mobile menu */}
        <div className="flex items-center lg:hidden">
          {mobileMode && (
            <Sheet
              open={isSidebarSheetOpen}
              onOpenChange={setIsSidebarSheetOpen}
            >
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" mode="icon">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                className="h-dvh w-[275px] max-w-[85vw] gap-0 overflow-hidden bg-[#556B2F] p-0"
                side="left"
                close={false}
              >
                <SheetHeader className="shrink-0 space-y-0 bg-[#556B2F] p-0" />

                <SheetBody className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto bg-[#556B2F] p-0">
                  <div className="min-h-full w-full bg-[#556B2F]">
                    <SidebarMenu />
                  </div>
                </SheetBody>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Search */}
        <div className="flex items-center">
          <SearchDialog
            trigger={
              <button
                type="button"
                className="flex h-10 w-[340px] items-center gap-3 rounded-lg bg-[#F5F5F3] px-3 text-left transition-colors hover:bg-[#EEEEEB]"
              >
                <Search className="size-4 text-[#30352D]" />

                <span className="text-sm text-muted-foreground">
                  Rechercher...
                </span>
              </button>
            }
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {/* Notifications */}
          <NotificationsSheet
            trigger={
              <Button
                variant="ghost"
                mode="icon"
                shape="circle"
                className="size-10 hover:bg-muted"
              >
                <Bell className="size-5 text-[#1F241D]" />
              </Button>
            }
          />

          {/* User */}
          <UserDropdownMenu
            trigger={
              <button
                type="button"
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted"
              >
                {/* Avatar */}
                <div className="flex size-10 items-center justify-center rounded-full bg-[#526B2F] text-sm font-semibold text-white">
                  A
                </div>

                {/* Name */}
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold leading-5 text-[#1F241D]">
                    Ayah
                  </p>

                  <p className="text-xs leading-4 text-muted-foreground">
                    Administrateur
                  </p>
                </div>

                {/* Arrow */}
                <ChevronDown className="hidden size-4 text-[#1F241D] sm:block" />
              </button>
            }
          />
        </div>
      </Container>
    </header>
  );
}
