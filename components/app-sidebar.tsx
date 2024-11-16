'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';

import LogoWhite from '@/public/images/logo-white.png';
import { PlusIcon } from '@/components/icons';
import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { BetterTooltip } from '@/components/ui/tooltip';
import Link from 'next/link';
import Image from 'next/image';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className='group-data-[side=left]:border-r-0'>
      <SidebarHeader>
        <SidebarMenu>
          <div className='flex flex-row justify-between items-center'>
            <Link
              href='/'
              onClick={() => {
                setOpenMobile(false);
              }}
              className='flex flex-row gap-3 items-center'
            >
              <Image src={LogoWhite} alt='logo' width={180} height={40} />
            </Link>

            <BetterTooltip content='New Chat' align='start'>
              <Button
                variant='ghost'
                type='button'
                className='p-2 h-fit'
                onClick={() => {
                  setOpenMobile(false);
                  router.push('/');
                  router.refresh();
                }}
              >
                <PlusIcon />
              </Button>
            </BetterTooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className='-mx-2'>
          <SidebarHistory user={user} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='gap-0 -mx-2'>
        <SidebarGroup>
          <SidebarGroupContent>
            <DynamicWidget />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
