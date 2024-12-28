// Email validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !regex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
export const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!password || !regex.test(password)) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number'
    };
  }
  return { isValid: true, message: '' };
};

// Name validation (2-50 chars, letters and spaces only)
export const validateName = (name) => {
  const regex = /^[A-Za-z\s]{2,50}$/;
  if (!name || !regex.test(name)) {
    return { 
      isValid: false, 
      message: 'Name must be 2-50 characters long and contain only letters'
    };
  }
  return { isValid: true, message: '' };
};

// Task title validation (2-100 chars)
export const validateTaskTitle = (title) => {
  if (!title || title.length < 2 || title.length > 100) {
    return {
      isValid: false,
      message: 'Task title must be between 2 and 100 characters'
    };
  }
  return { isValid: true, message: '' };
};

// Task description validation (max 500 chars)
export const validateTaskDescription = (description) => {
  if (description && description.length > 500) {
    return {
      isValid: false,
      message: 'Description must not exceed 500 characters'
    };
  }
  return { isValid: true, message: '' };
};

// Date validation
export const validateDate = (date) => {
  const selectedDate = new Date(date);
  if (!date || isNaN(selectedDate.getTime())) {
    return { isValid: false, message: 'Please enter a valid date' };
  }
  return { isValid: true, message: '' };
};

// Task date range validation
export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end < start) {
    return {
      isValid: false,
      message: 'End date must be after start date'
    };
  }
  return { isValid: true, message: '' };
};

// Priority validation
export const validatePriority = (priority) => {
  const validPriorities = ['High', 'Medium', 'Low'];
  if (!validPriorities.includes(priority)) {
    return {
      isValid: false,
      message: 'Priority must be High, Medium, or Low'
    };
  }
  return { isValid: true, message: '' };
};

// Status validation
export const validateStatus = (status) => {
  const validStatuses = ['Todo', 'In Progress', 'Completed', 'Expired', 'Not Started'];
  if (!validStatuses.includes(status)) {
    return {
      isValid: false,
      message: 'Invalid status value'
    };
  }
  return { isValid: true, message: '' };
};

// General input validation
export const validateInput = (inputType, value, options = {}) => {
  switch (inputType) {
    case 'email':
      return validateEmail(value);
    case 'password':
      return validatePassword(value);
    case 'name':
      return validateName(value);
    case 'taskTitle':
      return validateTaskTitle(value);
    case 'description':
      return validateTaskDescription(value);
    case 'date':
      return validateDate(value);
    case 'dateRange':
      return validateDateRange(options.startDate, options.endDate);
    case 'priority':
      return validatePriority(value);
    case 'status':
      return validateStatus(value);
    default:
      return { isValid: false, message: 'Invalid input type' };
  }
};

// Form validation helper
export const validateForm = (formData) => {
  const errors = {};
  const fieldValidations = {
    email: 'email',
    password: 'password',
    name: 'name',
    taskTitle: 'taskTitle',
    description: 'description',
    dueDate: 'date',
    priority: 'priority',
    status: 'status',
  };

  // Validate all provided fields
  Object.entries(formData).forEach(([field, value]) => {
    if (field === 'startDate' && formData.endDate) {
      const rangeValidation = validateInput('dateRange', null, {
        startDate: value,
        endDate: formData.endDate
      });
      if (!rangeValidation.isValid) errors.dateRange = rangeValidation.message;
    } else if (fieldValidations[field]) {
      const validation = validateInput(fieldValidations[field], value);
      if (!validation.isValid) errors[field] = validation.message;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};