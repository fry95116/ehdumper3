import React, { useEffect, useState } from 'react';
import { ArrowLeft, Image, List } from '../icon';
import type { CommonProps } from './common';
import { useBoolean, useResponsive } from 'ahooks';
import { Drawer, DrawerHeader, DrawerItems } from 'flowbite-react';
import { Link } from '@tanstack/react-router';

const Header: React.FC<{ onNavClick?: () => void }> = (props) => {
  return (
    <div
      className={`fixed top-0 left-0 z-10 flex h-16 w-full flex-row items-center
        justify-center bg-gray-900`}
    >
      <div className="flex h-full w-full flex-row items-center justify-between px-4">
        <div className="text-lg font-bold text-white">Title</div>
        <div
          onClick={props.onNavClick}
          className="-mr-2 rounded-sm p-2 font-light text-gray-400 hover:bg-gray-800
            sm:hidden"
        >
          <List className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
};

const Menu: React.FC<{ showTitle?: boolean; className?: string }> = (props) => {
  const menuConfig: Array<{
    to: React.ComponentProps<typeof Link>['to'];
    title: string;
  }> = [
    { to: '/', title: '测试1' },
    { to: '/copy', title: '测试2' },
    { to: '/copy2', title: '测试3' },
  ];
  const menuItems = menuConfig.map((item) => (
    <Link
      to={item.to}
      key={item.to}
      className="text-light flex w-full flex-row flex-nowrap items-center gap-2 rounded-sm
        p-3 text-sm text-gray-400 transition-colors duration-300 ease-in-out"
      activeProps={{ className: 'bg-blue-600 text-blue-200' }}
    >
      <Image className="h-5 w-5 shrink-0" />
      <span
        className={`text-nowrap ${props.showTitle ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-300 ease-in-out`}
      >
        {item.title}
      </span>
    </Link>
  ));
  return (
    <div
      className={`flex w-full flex-col items-start justify-start gap-2 overflow-hidden
        ${props.className}`}
    >
      {menuItems}
    </div>
  );
};
const Sidebar: React.FC<
  CommonProps<
    React.PropsWithChildren<{ folded: boolean; width: number; onClick: () => void }>
  >
> = (props) => {
  return (
    <div
      className={`fixed top-16 left-0 hidden h-[calc(100vh-var(--spacing)*16)] bg-gray-800
        transition-[width] duration-300 ease-in-out sm:block`}
      style={{ ...props.style, width: `${props.width}px` }}
    >
      {props.children}
      <button
        onClick={props.onClick}
        className="focus:ring-opacity-80 absolute top-1/2 right-0 flex aspect-square h-6
          w-6 translate-x-1/2 translate-y-1/2 transform flex-row items-center
          justify-center rounded-full bg-gray-600 text-white hover:bg-gray-500 focus:ring
          focus:ring-gray-300 focus:outline-none"
      >
        <ArrowLeft
          className={'h-4 w-4 text-white transition-transform duration-300 ease-in-out'}
          style={{ transform: props.folded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
    </div>
  );
};

export const Layout: React.FC<React.PropsWithChildren<CommonProps>> = (props) => {
  const sidebarWidthConfig = { expend: 240, folded: 60 };
  const { md } = useResponsive();
  const [folded, setFolded] = useState(!md);
  const [drawerOpen, { setFalse: closeDrawer, setTrue: openDrawer }] = useBoolean(false);
  useEffect(() => {
    if (!md) {
      setFolded(true);
    } else {
      setFolded(false);
    }
  }, [md]);
  const width = folded ? sidebarWidthConfig.folded : sidebarWidthConfig.expend;
  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-gray-950">
        <div className={'h-16 w-full'} />
        <div className="flex flex-1 flex-row items-start justify-start">
          {/** Sidebar placeholder */}
          <div
            className="hidden h-1/2 shrink-0 transition-[width] duration-300 ease-in-out
              sm:block"
            style={{
              width: `${folded ? sidebarWidthConfig.folded : sidebarWidthConfig.expend}px`,
            }}
          />
          <div className="min-h-full flex-1 basis-0 overflow-x-hidden">
            {props.children}
          </div>
        </div>
      </div>
      <Header onNavClick={openDrawer} />
      <Sidebar
        className="sm:hidden"
        width={width}
        folded={folded}
        onClick={() => setFolded((v) => !v)}
      >
        <Menu showTitle={!folded} className="p-2" />
      </Sidebar>
      <Drawer open={drawerOpen} onClose={closeDrawer}>
        {' '}
        <DrawerHeader title="MENU" titleIcon={() => <></>} />{' '}
        <DrawerItems>
          <Menu showTitle />
        </DrawerItems>
      </Drawer>
    </>
  );
};
