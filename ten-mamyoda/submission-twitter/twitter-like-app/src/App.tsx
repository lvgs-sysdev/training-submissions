import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { CreatePostPage } from './pages/CreatePostPage';
import { NoMatch } from './pages/NoMatch';
import { ROUTES } from './constants';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path="/user/:userId" element={<UserProfilePage />} />
      <Route path={ROUTES.EDIT_PROFILE} element={<EditProfilePage />} />
      <Route path={ROUTES.CREATE_POST} element={<CreatePostPage />} />
      <Route path={ROUTES.NOT_FOUND} element={<NoMatch />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default App;
