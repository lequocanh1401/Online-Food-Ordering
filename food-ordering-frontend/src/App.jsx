import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUser } from './State/Authentication/Action';
import { findCart } from './State/Cart/Action';
import { AuthModal } from './components/Auth/AuthModal';
import { CustomerRoutes } from './Routers/CustomerRoutes';
import { Admin } from './components/Admin/Admin';
import { ScrollToTop } from './util/ScrollToTop';

// 2 Dòng import mới cho Theme của Zosh
import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme } from './Theme/DarkTheme';

function App() {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const auth = useSelector(store => store.auth);

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
      dispatch(findCart(jwt));
    }
  }, [auth.jwt, dispatch, jwt]);

  return (
    // Bọc ThemeProvider và CssBaseline ra ngoài cùng
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <ScrollToTop />
        <div className='bg-gray-900 min-h-screen text-white'>
          <Routes>
            <Route path='/*' element={<CustomerRoutes />} />
            <Route path='/admin/restaurant/*' element={<Admin />} />
          </Routes>
          <AuthModal />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;