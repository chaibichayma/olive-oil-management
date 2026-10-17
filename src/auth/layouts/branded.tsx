import { Outlet } from 'react-router-dom';

import { Card, CardContent } from '@/components/ui/card';

export function BrandedLayout() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-[600px] rounded-2xl">
        <CardContent className="p-8 sm:p-10">
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
}