import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import BackgroundMosaic from './BackgroundMosaic'

export const Layout = () => {
  return (
    <>
      <BackgroundMosaic />
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}
