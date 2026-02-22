export const useUser = () => {
  const user = useState('auth_user', () => null);
  const token = useCookie('auth_token');
  const userCookie = useCookie('user_data');

  const logOut = () => {
    token.value = null;
    userCookie.value = null;
    user.value = null;
    navigateTo('/login');
  };

  return { user, token, logOut };
};
