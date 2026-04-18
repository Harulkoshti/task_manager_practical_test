import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/tasks';

// Helper to normalize backend status to Title Case for UI matching
const formatTask = (task) => ({
  ...task,
  status: task.status === 'completed' || task.status === 'Completed' ? 'Completed' : 'Pending'
});

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data.map(formatTask);
});

export const addTask = createAsyncThunk('tasks/addTask', async (name, { rejectWithValue }) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error('Failed to add task');
    }
    const data = await response.json();
    return formatTask(data);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const toggleTask = createAsyncThunk('tasks/toggleTask', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'PUT' });
    if (!response.ok) {
      throw new Error('Failed to toggle task');
    }
    const data = await response.json();
    return formatTask(data);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    filter: 'All', // All | Pending | Completed
    status: 'idle', // idle | loading | succeeded | failed
    error: null
  },
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(toggleTask.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(toggleTask.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(task => task.id !== action.payload);
      });
  }
});

export const { setFilter } = tasksSlice.actions;

export default tasksSlice.reducer;
