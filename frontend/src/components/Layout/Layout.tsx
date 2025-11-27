import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Sidebar } from '../Sidebar/Sidebar'
import { TopBar } from '../TopBar/TopBar'
import styles from './Layout.module.css'

interface Props {
  children: ReactNode
}

export function Layout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {sidebarOpen && isMobile && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} />

      <div
        className={`${styles.content} ${
          sidebarOpen ? styles.contentShift : ''
        }`}
      >
        {children}
      </div>
    </>
  )
}
