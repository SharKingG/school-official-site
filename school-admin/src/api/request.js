import { ElMessage } from "element-plus";
import { clearAuth, getToken } from "../utils/auth";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3001/api";

function buildUrl(url, params = {}) {
  const fullUrl = new URL(`${API_BASE_URL}${url}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      fullUrl.searchParams.append(key, value);
    }
  });

  return fullUrl.toString();
}

async function request(url, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    let result = null;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    if (response.status === 401) {
      clearAuth();
      ElMessage.error("登录已失效，请重新登录");
      window.location.href = "/login";
      throw new Error("登录已失效");
    }

    if (!response.ok) {
      const message =
        result?.message ||
        result?.error ||
        `请求失败，状态码：${response.status}`;

      ElMessage.error(Array.isArray(message) ? message.join("；") : message);
      throw new Error(Array.isArray(message) ? message.join("；") : message);
    }

    if (result && typeof result === "object" && "code" in result) {
      if (result.code === 0) {
        return result.data;
      }

      const message = result.message || "请求失败";
      ElMessage.error(Array.isArray(message) ? message.join("；") : message);
      throw new Error(Array.isArray(message) ? message.join("；") : message);
    }

    return result;
  } catch (error) {
    if (error.message !== "登录已失效") {
      ElMessage.error(error.message || "网络请求失败，请检查后端服务是否启动");
    }

    throw error;
  }
}

const service = {
  get(url, config = {}) {
    return request(buildUrl(url, config.params || {}), {
      method: "GET",
    });
  },

  post(url, data = {}) {
    return request(buildUrl(url), {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  patch(url, data = {}) {
    return request(buildUrl(url), {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  put(url, data = {}) {
    return request(buildUrl(url), {
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  delete(url) {
    return request(buildUrl(url), {
      method: "DELETE",
    });
  },
};

export default service;
