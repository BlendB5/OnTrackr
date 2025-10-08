const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Types
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'done';
  dueDate: string;
  reminder?: string;
  userId: string;
}

export interface Reminder {
  id: string;
  remindAt: string;
  message?: string;
  eventId?: string;
  taskId?: string;
  userId: string;
  Event?: Event;
  Task?: Task;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Events API
export const eventsApi = {
  // Get all events
  getAll: async (): Promise<Event[]> => {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  // Get events by date range
  getByRange: async (startDate: string, endDate: string): Promise<Event[]> => {
    const response = await fetch(
      `${API_BASE_URL}/api/events/range?startDate=${startDate}&endDate=${endDate}`,
      { headers: getAuthHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  // Create event
  create: async (event: Omit<Event, 'id' | 'userId'>): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(event)
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
  },

  // Update event
  update: async (id: string, event: Partial<Omit<Event, 'id' | 'userId'>>): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(event)
    });
    if (!response.ok) throw new Error('Failed to update event');
    return response.json();
  },

  // Delete event
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete event');
  }
};

// Tasks API
export const tasksApi = {
  // Get all tasks
  getAll: async (status?: string, dueDate?: string): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (dueDate) params.append('dueDate', dueDate);
    
    const response = await fetch(`${API_BASE_URL}/api/tasks?${params}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  // Create task
  create: async (task: Omit<Task, 'id' | 'userId'>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(task)
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  // Update task
  update: async (id: string, task: Partial<Omit<Task, 'id' | 'userId'>>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(task)
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  // Toggle task status
  toggle: async (id: string): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to toggle task');
    return response.json();
  },

  // Delete task
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete task');
  }
};

// Reminders API
export const remindersApi = {
  // Get all reminders
  getAll: async (upcoming?: boolean): Promise<Reminder[]> => {
    const params = new URLSearchParams();
    if (upcoming) params.append('upcoming', 'true');
    
    const response = await fetch(`${API_BASE_URL}/api/reminders?${params}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch reminders');
    return response.json();
  },

  // Get upcoming reminders
  getUpcoming: async (): Promise<Reminder[]> => {
    const response = await fetch(`${API_BASE_URL}/api/reminders/upcoming`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch upcoming reminders');
    return response.json();
  },

  // Create reminder
  create: async (reminder: Omit<Reminder, 'id' | 'userId'>): Promise<Reminder> => {
    const response = await fetch(`${API_BASE_URL}/api/reminders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reminder)
    });
    if (!response.ok) throw new Error('Failed to create reminder');
    return response.json();
  },

  // Update reminder
  update: async (id: string, reminder: Partial<Omit<Reminder, 'id' | 'userId'>>): Promise<Reminder> => {
    const response = await fetch(`${API_BASE_URL}/api/reminders/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(reminder)
    });
    if (!response.ok) throw new Error('Failed to update reminder');
    return response.json();
  },

  // Delete reminder
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/reminders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete reminder');
  }
};


