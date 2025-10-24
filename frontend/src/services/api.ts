// Declare the global variable for TypeScript
declare const __API_URL__: string;

// Dynamically determine the API base URL based on the environment
const API_BASE_URL = typeof __API_URL__ !== 'undefined' ? __API_URL__ : '/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsedUser = JSON.parse(user);
    return {
      'Authorization': `Bearer ${parsedUser.token}`,
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const responseText = await response.text();
  console.log('API Response Status:', response.status);
  console.log('API Response Text:', responseText);
  
  // If response is empty, return empty object
  if (!responseText) {
    if (response.ok) {
      return {};
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
  
  // Try to parse as JSON
  try {
    const data = JSON.parse(responseText);
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return data;
  } catch (e) {
    // If JSON parsing fails, throw an error with the raw text
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${responseText}`);
    }
    // For successful responses that aren't JSON, return the text
    return responseText;
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    console.log('Login request:', { email, password });
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    return handleResponse(response);
  },
  
  register: async (email: string, password: string, name: string) => {
    console.log('Register request:', { email, password, name });
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });
    
    return handleResponse(response);
  },
};

// Lessons API
export const lessonsAPI = {
  getAllLessons: async () => {
    // Add a small delay to prevent excessive requests
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await fetch(`${API_BASE_URL}/lessons`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
  
  getLessonById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
  
  likeLesson: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
  
  dislikeLesson: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}/dislike`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
  
  getUserLessonFeedback: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}/feedback`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
};

// Quizzes API
export const quizzesAPI = {
  getAllQuizzes: async () => {
    const response = await fetch(`${API_BASE_URL}/quizzes`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
  
  getQuizById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
};

// Tips API
export const tipsAPI = {
  getAllTips: async () => {
    // Add a small delay to prevent excessive requests
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await fetch(`${API_BASE_URL}/tips`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
};

// Appointments API
export const appointmentsAPI = {
  createAppointment: async (data: any) => {
    console.log('Sending appointment request with data:', data); // Debug log
    const headers = getAuthHeaders();
    console.log('Using headers:', headers); // Debug log
    
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });
    
    console.log('Appointment response status:', response.status); // Debug log
    
    // Try to parse response as JSON, fallback to text if it fails
    let responseData;
    const responseText = await response.text();
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      // If JSON parsing fails, use the raw text
      responseData = responseText;
    }
    
    console.log('Appointment response data:', responseData); // Debug log
    
    if (!response.ok) {
      console.error('Appointment creation failed with response:', responseData); // Debug log
      throw new Error(`Failed to create appointment: ${typeof responseData === 'string' ? responseData : responseData.message || 'Unknown error'}`);
    }
    
    // If we have a string response, try to parse it as JSON
    if (typeof responseData === 'string') {
      try {
        return JSON.parse(responseData);
      } catch (e) {
        return responseData;
      }
    }
    
    console.log('Appointment creation successful:', responseData); // Debug log
    return responseData;
  },
  
  getAllAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
  
  getAppointmentById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
  
  updateAppointmentStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    
    return handleResponse(response);
  },
};

// Admin API
export const adminAPI = {
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
  
  getLessonFeedbackDetails: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/lesson-feedback-details`, {
        headers: getAuthHeaders(),
      });
      
      return handleResponse(response);
    } catch (error) {
      // Handle network errors or other issues
      throw new Error('Failed to connect to the server. Please check your connection and try again.');
    }
  },
  
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
  
  getAllAppointments: async () => {
    // Add a small delay to prevent excessive requests
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await fetch(`${API_BASE_URL}/admin/appointments`, {
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
  
  createLesson: async (data: any) => {
    // Add a small delay to prevent excessive requests
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await fetch(`${API_BASE_URL}/admin/lessons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
  
  updateLesson: async (id: string, data: any) => {
    // Add a small delay to prevent excessive requests
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await fetch(`${API_BASE_URL}/admin/lessons/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  },
  
  deleteLesson: async (id: string) => {
    // Add a small delay to prevent excessive requests
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await fetch(`${API_BASE_URL}/admin/lessons/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },
};

// User API
export const userAPI = {
  updateCreditInfo: async (data: { currentCreditScore?: number | null; targetCreditScore?: number | null; extraMonthlyPayment?: number | null }) => {
    console.log('Sending user credit info update request:', data);
    const headers = getAuthHeaders();
    console.log('Using headers:', headers);
    
    const response = await fetch(`${API_BASE_URL}/users/credit-info`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data),
    });
    
    console.log('User credit info update response status:', response.status);
    
    return handleResponse(response);
  },
};