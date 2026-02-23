import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
//
import axios, { endpoints } from 'src/utils/axios';
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'SET_USER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const normalizeUser = useCallback((user = {}) => ({
    ...user,
    // Keep frontend stable against backend naming variations.
    isFirstTime:
      user.isFirstTime ??
      user.mustChangePassword ??
      false,
  }), []);

  const refreshUser = useCallback(async () => {
    const response = await axios.get(endpoints.auth.me);
    const user = normalizeUser(response.data);

    dispatch({
      type: 'SET_USER',
      payload: {
        user,
      },
    });

    return user;
  }, [normalizeUser]);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      // localStorage.setItem(STORAGE_KEY, accessToken);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axios.get(endpoints.auth.me);

        const user = normalizeUser(response.data);
        if (!user.roles.includes('company')) {
          setSession(null);
          dispatch({
            type: 'INITIAL',
            payload: {
              user: null,
            },
          });
          return;
        }

        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...user,
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, [normalizeUser]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password, rememberMe) => {
    const data = {
      email,
      password,
      rememberMe,
    };

    const response = await axios.post(endpoints.auth.login, data);

    const { accessToken, user: loginUser } = response.data;
    const user = normalizeUser(loginUser);

    if (!user?.roles?.includes('company')) {
      throw new Error("User Doesn't have permission");
    }

    setSession(accessToken);

    // Ensure flags like `isBusinessKycComplete` are present immediately after login.
    const meUser = await refreshUser();
    return meUser;
  }, [normalizeUser, refreshUser]);

  // REGISTER
  const register = useCallback(async (email, password, fullName, lastName) => {
    const data = {
      email,
      password,
      fullName,
      lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);

    const { accessToken, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const forgotPassword = useCallback(async (email) => {
    const payload = {
      email,
      role: 'company',
    };

    await axios.post(endpoints.auth.forgotPassword, payload);
  }, []);

  const newPassword = useCallback(async (email, otp, newPassword) => {
    const payload = {
      email,
      otp,
      role: 'company',
      newPassword,
    };

    await axios.post(endpoints.auth.newPassword, payload);
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
      forgotPassword,
      newPassword,
      refreshUser,
    }),
    [login, logout, register, forgotPassword, newPassword, refreshUser, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
