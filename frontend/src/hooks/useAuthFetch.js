import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken, logout } from "../redux/slices/authSlice";

const useAuthFetch = (url, options = {}) => {
  const dispatch = useDispatch();
  const { accessToken, refreshToken: storedRefreshToken } = useSelector(state => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      let token = accessToken;
      let response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401 && storedRefreshToken) {
        // Token expired → refresh token
        const refreshRes = await dispatch(refreshToken());
        if (refreshRes.payload?.access_token) {
          token = refreshRes.payload.access_token;

          // Retry original request
          response = await fetch(url, {
            ...options,
            headers: {
              "Content-Type": "application/json",
              ...(options.headers || {}),
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          dispatch(logout());
          throw new Error("Session expired. Please login again.");
        }
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Something went wrong");
      }

      const resData = await response.json();
      setData(resData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};

export default useAuthFetch;
