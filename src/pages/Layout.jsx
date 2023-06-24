import React from 'react'
import { Outlet } from 'react-router-dom'
import SideMenu from '../components/SideMenu';
import './Layout.scss';

function Layout() {
  return (
    <div className="layout">
        <SideMenu />
        <main className="content">
            <Outlet />
        </main>
    </div>
  )
}

export default Layout