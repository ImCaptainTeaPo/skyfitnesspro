import axios from 'axios';
import { BASE_URL, RoutesApp } from '../constants';

type ApiError = {
  error?: string;
  message?: string;
};

type authUserReturn = {
  email: string;
  password: string;
  _id: string;
  selectedCourses: [];
  courseProgress: [];
  createdAt: string;
  updatedAt: string;
};

type authUserProp = {
  email: string;
  password: string;
};

type accessTokenType = {
  token: string;
};

export type tokensType = accessTokenType

export async function signIn(userData: authUserProp): Promise<tokensType> {
  try {
    const data = await axios.post(`${BASE_URL}${RoutesApp.login}`, userData, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErr = error.response.data as ApiError;

        throw new Error(apiErr.error ?? apiErr.message ?? 'Ошибка входа');
      }
      throw new Error(error.message);
    }
  }
  throw new Error();
}

export async function signUp(userData: {
  email: string;
  password: string;
}): Promise<authUserReturn> {
  try {
    const data = await axios.post(`${BASE_URL}${RoutesApp.register}`, userData, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      if (axios.isAxiosError(error) && error.response) {
        const apiErr = error.response.data as ApiError;

        throw new Error(apiErr.error ?? apiErr.message ?? 'Ошибка регистрации');
      }
      throw new Error(error.message);
    }
  }
  throw new Error();
}


export const getUserCourses = (token: tokensType): Promise<authUserReturn> => {
  return axios
  .get(`${BASE_URL}${RoutesApp.UserCourses}`, {
    headers: { Authorization: `Bearer ${token.token}` }
  })
    .then((res) => res.data.user);
};


