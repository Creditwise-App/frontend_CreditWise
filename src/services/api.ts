// Dynamically determine the API base URL based on the environment
const API_BASE_URL = typeof process !== 'undefined' && process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api' 
  : '/api';

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

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  },
  
  register: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
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
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch lessons');
    }
    
    return response.json();
  },
  
  getLessonById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch lesson');
    }
    
    return response.json();
  },
  
  likeLesson: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to like lesson');
    }
    
    return response.json();
  },
  
  dislikeLesson: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}/dislike`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to dislike lesson');
    }
    
    return response.json();
  },
  
  getUserLessonFeedback: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/lessons/${id}/feedback`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user feedback');
    }
    
    return response.json();
  },
};

// Quizzes API
export const quizzesAPI = {
  getAllQuizzes: async () => {
    const response = await fetch(`${API_BASE_URL}/quizzes`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch quizzes');
    }
    
    return response.json();
  },
  
  getQuizById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch quiz');
    }
    
    return response.json();
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
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch tips');
    }
    
    return response.json();
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
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch appointments');
    }
    
    return response.json();
  },
  
  getAppointmentById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch appointment');
    }
    
    return response.json();
  },
  
  updateAppointmentStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update appointment');
    }
    
    return response.json();
  },
};

// Admin API
export const adminAPI = {
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to fetch dashboard stats';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If we can't parse JSON, use the raw text
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  },
  
  getLessonFeedbackDetails: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/lesson-feedback-details`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to fetch lesson feedback details';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use the raw text
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      return response.json();
    } catch (error) {
      // Handle network errors or other issues
      throw new Error('Failed to connect to the server. Please check your connection and try again.');
    }
  },
  
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch users');
    }
    
    return response.json();
  },
  
  getAllAppointments: async () => {
    // Add a small delay to prevent excessive requests
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await fetch(`${API_BASE_URL}/admin/appointments`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch appointments');
    }
    
    return response.json();
  },
  
  createLesson: async (data: any) => {
    // Add a small delay to prevent excessive requests
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await fetch(`${API_BASE_URL}/admin/lessons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to create lesson';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  },
  
  updateLesson: async (id: string, data: any) => {
    // Add a small delay to prevent excessive requests
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await fetch(`${API_BASE_URL}/admin/lessons/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to update lesson';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
  },
  
  deleteLesson: async (id: string) => {
    // Add a small delay to prevent excessive requests
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await fetch(`${API_BASE_URL}/admin/lessons/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Failed to delete lesson';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
    
    return response.json();
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('User credit info update failed with response:', errorText);
      let errorMessage = 'Failed to update credit information';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
    
    const responseData = await response.json();
    console.log('User credit info update successful:', responseData);
    return responseData;
  },
};
