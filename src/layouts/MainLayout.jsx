import { Outlet } from 'react-router-dom'
import HeaderComponent from './Header'
import FooterComponent from './Footer'
import ContentComponent from './Content'

function MainLayout() {
  return (
    <>
      <HeaderComponent />
      <ContentComponent>
        <Outlet />
      </ContentComponent>
      <FooterComponent />
    </>
  )
}

export default MainLayout