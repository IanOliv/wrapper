const apiEndpoint = import.meta.env.VITE_POSTGREST_ENDPOINT;

export const api = {
  get: async (path: string, params?: Record<string, string>) => {
    const url = new URL(`${apiEndpoint}/${path}`);
    if (params) {
      Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    }
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }
    return response.json();
  },

  post: async (path: string, body: Record<string, unknown>) => {
    const response = await fetch(`${apiEndpoint}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Error posting to ${path}: ${response.statusText}`);
    }
    return response.json();
  },
  put: async (path: string, body: Record<string, unknown>) => {
    const response = await fetch(`${apiEndpoint}/${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Error putting to ${path}: ${response.statusText}`);
    }
    return response.json();
  },
  delete: async (path: string, params?: Record<string, string>) => {
    const url = new URL(`${apiEndpoint}/${path}`);
    if (params) {
      Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
    }
    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error deleting ${url}: ${response.statusText}`);
    }
    return response.json();
  },
};

export const doLogin = async (email: string, password: string) => {
  const response = await api.post('rpc/login', { email, password });
  console.log(response);
  if (response.token) {
    console.log('Login successful');
    return response.token;
  } else {
    throw new Error('Invalid username or password');
  }
};
export const doRegister = async (email: string, password: string) => {
  const response = await api.post('rpc/register', { email, password });
  if (response.success) {
    console.log('Registration successful');
    return response.token;
  } else {
    throw new Error('Registration failed');
  }
};
export const doLogout = async (token: string) => {
  const response = await api.post('rpc/logout', { token });
  if (response.success) {
    console.log('Logout successful');
    return true;
  } else {
    throw new Error('Logout failed');
  }
};
export const doGetUserProfile = async (token: string) => {
  const response = await api.get('rpc/get_user_profile', { token });
  if (response.success) {
    console.log('User profile fetched successfully');
    return response.profile;
  } else {
    throw new Error('Failed to fetch user profile');
  }
};
export const doUpdateUserProfile = async (token: string, profileData: Record<string, unknown>) => {
  const response = await api.post('rpc/update_user_profile', { token, ...profileData });
  if (response.success) {
    console.log('User profile updated successfully');
    return response.profile;
  } else {
    throw new Error('Failed to update user profile');
  }
};
export const doGetUserSettings = async (token: string) => {
  const response = await api.get('rpc/get_user_settings', { token });
  if (response.success) {
    console.log('User settings fetched successfully');
    return response.settings;
  } else {
    throw new Error('Failed to fetch user settings');
  }
};
export const doUpdateUserSettings = async (
  token: string,
  settingsData: Record<string, unknown>,
) => {
  const response = await api.post('rpc/update_user_settings', { token, ...settingsData });
  if (response.success) {
    console.log('User settings updated successfully');
    return response.settings;
  } else {
    throw new Error('Failed to update user settings');
  }
};
export const doGetUserNotifications = async (token: string) => {
  const response = await api.get('rpc/get_user_notifications', { token });
  if (response.success) {
    console.log('User notifications fetched successfully');
    return response.notifications;
  } else {
    throw new Error('Failed to fetch user notifications');
  }
};
export const doMarkNotificationAsRead = async (token: string, notificationId: string) => {
  const response = await api.post('rpc/mark_notification_as_read', { token, notificationId });
  if (response.success) {
    console.log('Notification marked as read successfully');
    return true;
  } else {
    throw new Error('Failed to mark notification as read');
  }
};
