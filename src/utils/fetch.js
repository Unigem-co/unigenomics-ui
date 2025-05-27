const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const request = async (endpoint, options = {}, onSuccess, onError) => {
  console.log(`Making ${options.method} request to ${endpoint}`, {
    options,
    body: options.body
  });

  const token = localStorage.getItem('token');
  if (!token && !endpoint.includes('login')) {
    console.error('No token found');
    window.location.href = '/login';
    return;
  }
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Stringify body if Content-Type is application/json and body is an object
  if (config.body && config.headers['Content-Type'] === 'application/json' && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    console.log('Request config:', {
      url: `${API_URL}/${endpoint}`,
      method: config.method,
      headers: config.headers,
      body: config.body
    });

    const response = await fetch(`${API_URL}/${endpoint}`, config);
    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      
      let errorData;
      try {
        errorData = await response.json();
        console.error('Error response data:', errorData);
      } catch (e) {
        console.error('Could not parse error response as JSON');
        errorData = { message: response.statusText || 'Error de red' };
      }

      if (response.status === 401 || response.status === 403) {
        // Handle unauthorized/forbidden access
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Sesión expirada o acceso denegado');
      }
      
      const error = new Error(errorData.message || 'Error del servidor');
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('Parsed JSON response:', data);
    } else {
      data = await response.text();
      console.log('Received text response:', data);
    }

    if (onSuccess) {
      onSuccess(data);
    }
    
    return data;
  } catch (error) {
    console.error('Request failed:', error);
    if (onError) {
      onError(error);
    }
    throw error;
  }
};

export const fileRequest = (endpoint, options = {}, onSuccess, onError) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    window.location.href = '/login';
    return;
  }
  
  const defaultHeaders = {
    'Authorization': `Bearer ${token}`,
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  console.log('Making file request:', {
    url: `${API_URL}/${endpoint}`,
    method: config.method,
    headers: config.headers
  });

  fetch(`${API_URL}/${endpoint}`, config)
    .then(async (response) => {
      console.log('File response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error('Sesión expirada o acceso denegado');
        }
        throw new Error('Error al procesar el archivo');
      }
      
      // Return blob for binary PDF data
      const blob = await response.blob();
      onSuccess(blob);
    })
    .catch(error => {
      console.error('File request failed:', error);
      onError(error);
    });
};