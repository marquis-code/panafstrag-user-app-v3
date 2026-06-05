export const useLogout = () => {
  const { locale } = useI18n();
  const logout = () => {
    const token = useCookie('auth_token');
    const userCookie = useCookie('user_data');

    token.value = null;
    userCookie.value = null;

    navigateTo('/login');
  };

  return { logout };
};
