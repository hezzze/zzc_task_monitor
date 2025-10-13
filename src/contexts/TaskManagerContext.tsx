import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TaskData, ApiTaskResponse, Workflow, TaskSubmissionResponse, TasksResponse, SortOptions } from '../types';
import { useToastContext } from './ToastContext';

const RANDOM_PROMPTS = [
  "a majestic dragon soaring through stormy clouds",
  "a cyberpunk cityscape with neon lights at night",
  "a peaceful zen garden with cherry blossoms",
  "a steampunk airship floating above Victorian London",
  "a mystical forest with glowing mushrooms and fairies",
  "a futuristic robot playing chess with a human",
  "a vintage car driving through a desert sunset",
  "a magical castle floating on clouds",
  "a pirate ship sailing through a cosmic nebula",
  "a cozy cabin in a snowy mountain landscape",
  "a underwater city with mermaids and coral reefs",
  "a samurai warrior meditating under a waterfall",
  "a space station orbiting a distant planet",
  "a medieval knight riding a mechanical horse",
  "a phoenix rising from flames in an ancient temple",
  "a time traveler's workshop filled with clockwork gadgets",
  "a giant tree house in an enchanted forest",
  "a alien marketplace on a distant moon",
  "a lighthouse keeper's cottage during a thunderstorm",
  "a crystal cave with rainbow reflections and gems"
];

interface TaskManagerContextType {
  tasks: Map<string, TaskData>;
  getRandomPrompt: () => string;
  createWorkflow: (prompt: string) => Promise<Workflow>;
  createVideoWorkflow: (imageName: string, videoName: string) => Promise<Workflow>;
  submitTask: (workflow: Workflow, schedulerUrl: string) => Promise<TaskSubmissionResponse>;
  submitVaceControlVideoTask: (imageFile: File, videoFile: File) => Promise<TaskSubmissionResponse>;
  submitInfiniteTalkTask: (imageFile: File, audioFile: File) => Promise<TaskSubmissionResponse>;
  submitT2VTask: (prompt: string, schedulerUrl: string) => Promise<TaskSubmissionResponse>;
  submitI2VTask: (imageFile: File, schedulerUrl: string) => Promise<TaskSubmissionResponse>;
  monitorTask: (taskId: string, prompt: string, schedulerUrl: string) => Promise<void>;
  loadExistingTasks: (schedulerUrl: string, sortOptions?: SortOptions) => Promise<void>;
  clearGallery: () => void;
}

const TaskManagerContext = createContext<TaskManagerContextType | undefined>(undefined);

export const useTaskManagerContext = (): TaskManagerContextType => {
  const context = useContext(TaskManagerContext);
  if (!context) {
    throw new Error('useTaskManagerContext must be used within a TaskManagerProvider');
  }
  return context;
};

interface TaskManagerProviderProps {
  children: ReactNode;
}

export const TaskManagerProvider: React.FC<TaskManagerProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Map<string, TaskData>>(new Map());
  const { showToast } = useToastContext();

  // Get random prompt
  const getRandomPrompt = useCallback((): string => {
    return RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
  }, []);

  // Create workflow from prompt
  const createWorkflow = useCallback(async (prompt: string): Promise<Workflow> => {
    try {
      // Use process.env.PUBLIC_URL to handle both local dev and production
      const response = await fetch(`${process.env.PUBLIC_URL}/default_workflow.json`);
      if (!response.ok) {
        throw new Error(`Failed to load workflow: ${response.status}`);
      }
      
      const workflowData = await response.json();
      const workflow = JSON.parse(JSON.stringify(workflowData.workflow));
      
      if (workflow['28'] && workflow['28'].inputs) {
        workflow['28'].inputs.string = prompt;
      } else {
        console.warn('Node 28 not found in workflow, using fallback structure');
        return {
          "28": {
            "class_type": "String Literal",
            "inputs": {
              "string": prompt,
              "speak_and_recognation": true
            }
          }
        };
      }
      
      return workflow;
    } catch (error) {
      console.error('Error loading workflow:', error);
      return {
        "28": {
          "class_type": "String Literal",
          "inputs": {
            "string": prompt,
            "speak_and_recognation": true
          }
        }
      };
    }
  }, []);

  // Create video workflow from image and video filenames
  const createVideoWorkflow = useCallback(async (imageName: string, videoName: string): Promise<Workflow> => {
    try {
      // Use process.env.PUBLIC_URL to handle both local dev and production
      const response = await fetch(`${process.env.PUBLIC_URL}/video_workflow.json`);
      if (!response.ok) {
        throw new Error(`Failed to load video workflow: ${response.status}`);
      }
      
      const workflowData = await response.json();
      const workflow = JSON.parse(JSON.stringify(workflowData.workflow));
      
      // Update node 58 with image filename
      if (workflow['58'] && workflow['58'].inputs) {
        workflow['58'].inputs.image = imageName;
      } else {
        console.warn('Node 58 not found in video workflow');
      }
      
      // Update node 119 with video filename
      if (workflow['119'] && workflow['119'].inputs) {
        workflow['119'].inputs.video = videoName;
      } else {
        console.warn('Node 119 not found in video workflow');
      }
      
      return workflow;
    } catch (error) {
      console.error('Error loading video workflow:', error);
      throw error;
    }
  }, []);

  // Extract prompt from workflow
  const extractPromptFromWorkflow = useCallback((workflow: Workflow): string => {
    if (workflow && workflow['28'] && workflow['28'].inputs && workflow['28'].inputs.string) {
      return workflow['28'].inputs.string;
    }
    
    for (const nodeId in workflow) {
      const node = workflow[nodeId];
      if (node && node.inputs) {
        if (node.inputs.string && typeof node.inputs.string === 'string' && node.inputs.string.length > 10) {
          return node.inputs.string;
        }
        if (node.inputs.prompt && typeof node.inputs.prompt === 'string') {
          return node.inputs.prompt;
        }
        if (node.inputs.text && typeof node.inputs.text === 'string' && node.inputs.text.length > 10) {
          return node.inputs.text;
        }

        // wan2.2 t2v
        if (node.inputs.positive_prompt && typeof node.inputs.positive_prompt === 'string') {
          return node.inputs.positive_prompt;
        }
        
      }
    }
    
    return 'Generated Media';
  }, []);

  // Utility function to map API response to UI data
  const mapApiTaskToTaskData = useCallback((apiTask: ApiTaskResponse): TaskData => {
    // Extract prompt from workflow if not directly available
    let prompt = apiTask.prompt;
    if (!prompt && apiTask.workflow) {
      const workflow = typeof apiTask.workflow === 'string' ? JSON.parse(apiTask.workflow) : apiTask.workflow;
      prompt = extractPromptFromWorkflow(workflow);
    }

    return {
      id: apiTask.id,
      prompt: prompt || '',
      status: apiTask.status,
      result: apiTask.result,
      error: apiTask.error,
      workerId: apiTask.worker_id,
      priority: apiTask.priority,
      timeout: apiTask.timeout,
      createdAt: apiTask.created_at,
      updatedAt: apiTask.updated_at,
      startedAt: apiTask.started_at,
      completedAt: apiTask.completed_at,
      startTime: apiTask.created_at ? new Date(apiTask.created_at).getTime() : Date.now(),
      endTime: apiTask.completed_at ? new Date(apiTask.completed_at).getTime() : undefined,
      workflow: apiTask.workflow
    };
  }, [extractPromptFromWorkflow]);

  // Submit task to scheduler
  const submitTask = useCallback(async (workflow: Workflow, schedulerUrl: string): Promise<TaskSubmissionResponse> => {
    const response = await fetch(`${schedulerUrl}/api/v1/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        workflow: workflow,
        priority: 1,
        timeout: 600
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  }, []);

  // Submit video task with file upload
  const submitVaceControlVideoTask = useCallback(async (imageFile: File, videoFile: File): Promise<TaskSubmissionResponse> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('video', videoFile);

    const response = await fetch("https://api.zzcreation.com/web/scheduler_i2v_vace_fun", {
      method: 'POST',
      body: formData,
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY || ''
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  }, []);

  // Submit infinite talk task with image and audio files
  const submitInfiniteTalkTask = useCallback(async (imageFile: File, audioFile: File): Promise<TaskSubmissionResponse> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('audio', audioFile);

    const response = await fetch("https://api.zzcreation.com/web/scheduler_infinite_talk", {
      method: 'POST',
      body: formData,
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY || ''
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  }, []);

  // Submit text-to-video task
  const submitT2VTask = useCallback(async (prompt: string): Promise<TaskSubmissionResponse> => {
    const response = await fetch(`https://api.zzcreation.com/web/scheduler_t2v`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_API_KEY || ''
      },
      body: JSON.stringify({
        prompt: prompt
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  }, []);

  // Submit image-to-video task
  const submitI2VTask = useCallback(async (imageFile: File, schedulerUrl: string): Promise<TaskSubmissionResponse> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`https://api.zzcreation.com/web/scheduler_i2v`, {
      method: 'POST',
      body: formData,
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY || ''
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  }, []);

  // Handle task completion
  const handleTaskCompleted = useCallback((taskData: TaskData) => {
    const completedTaskData = {
      ...taskData,
      status: 'completed' as const,
      endTime: Date.now()
    };
    setTasks(prev => new Map(prev.set(taskData.id, completedTaskData)));
    showToast(`Task completed: ${taskData.id}`, 'success');
  }, [showToast]);

  // Handle task failure
  const handleTaskFailed = useCallback((taskData: TaskData) => {
    const failedTaskData = {
      ...taskData,
      status: taskData.status, // Keep the original status (failed/timeout)
      endTime: taskData.endTime || Date.now()
    };
    setTasks(prev => new Map(prev.set(taskData.id, failedTaskData)));
    showToast(`Task failed: ${taskData.id}`, 'error');
  }, [showToast]);

  // Add pending task
  const addPendingTask = useCallback((taskId: string, prompt: string) => {
    const pendingTask: TaskData = {
      id: taskId,
      prompt: prompt,
      status: 'pending'
    };
    
    setTasks(prev => new Map(prev.set(taskId, pendingTask)));
  }, []);

  // Monitor task progress
  const monitorTask = useCallback(async (taskId: string, prompt: string, schedulerUrl: string) => {
    const taskData: TaskData = {
      id: taskId,
      prompt: prompt,
      status: 'pending',
      startTime: Date.now(),
      result: undefined
    };
    
    setTasks(prev => new Map(prev.set(taskId, taskData)));
    
    // Add pending task immediately
    addPendingTask(taskId, prompt);
    
    let retryCount = 0;
    const maxRetries = 10;
    
    const pollTask = async () => {
      try {
        const response = await fetch(`${schedulerUrl}/api/v1/tasks/${taskId}`);
        if (response.ok) {
          retryCount = 0; // Reset retry count on successful response
          const apiTask: ApiTaskResponse = await response.json();
          const mappedTaskData = mapApiTaskToTaskData(apiTask);
          const updatedTaskData: TaskData = {
            ...taskData,
            ...mappedTaskData,
            // Preserve original startTime from when monitoring began
            startTime: taskData.startTime
          };
          
          if (apiTask.status === 'completed') {
            handleTaskCompleted(updatedTaskData);
          } else if (apiTask.status === 'failed' || apiTask.status === 'timeout') {
            handleTaskFailed(updatedTaskData);
          } else {
            // Update status for intermediate states (processing, running, etc.)
            setTasks(prev => new Map(prev.set(taskId, updatedTaskData)));
            setTimeout(pollTask, 2000);
          }
        } else {
          retryCount++;
          if (retryCount >= maxRetries) {
            const failedTaskData: TaskData = {
              ...taskData,
              status: 'failed',
              error: `API error: ${response.status} ${response.statusText}`,
              endTime: Date.now()
            };
            handleTaskFailed(failedTaskData);
          } else {
            setTimeout(pollTask, 2000);
          }
        }
      } catch (error) {
        console.error('Error polling task:', error);
        retryCount++;
        if (retryCount >= maxRetries) {
          const failedTaskData: TaskData = {
            ...taskData,
            status: 'failed',
            error: `Network error: ${(error as Error).message}`,
            endTime: Date.now()
          };
          handleTaskFailed(failedTaskData);
        } else {
          setTimeout(pollTask, 5000);
        }
      }
    };
    
    setTimeout(pollTask, 1000);
  }, [handleTaskCompleted, handleTaskFailed, addPendingTask, mapApiTaskToTaskData]);

  // Load existing tasks
  const loadExistingTasks = useCallback(async (schedulerUrl: string, sortOptions?: SortOptions) => {
    try {
      // Build URL with sorting parameters
      const url = new URL(`${schedulerUrl}/api/v1/tasks`);
      
      // Use provided sortOptions or default values
      const sortBy = sortOptions?.sortBy || 'created_at';
      const sortOrder = sortOptions?.sortOrder || 'desc';
      
      url.searchParams.append('sort_by', sortBy);
      url.searchParams.append('sort_order', sortOrder);
      
      const response = await fetch(url.toString());
      if (response.ok) {
        const resp: TasksResponse = await response.json();
        
        const newTasks = new Map<string, TaskData>();
        
        for (const apiTask of resp.tasks) {
          const taskData = mapApiTaskToTaskData(apiTask);
          newTasks.set(taskData.id, taskData);
        }
        
        setTasks(newTasks);
        
        if (resp.tasks.length > 0) {
          showToast(`Loaded ${resp.tasks.length} existing tasks`, 'info');
        }
      }
    } catch (error) {
      showToast(`Failed to load existing tasks: ${(error as Error).message}`, 'error');
    }
  }, [mapApiTaskToTaskData, showToast]);

  // Clear gallery
  const clearGallery = useCallback(() => {
    setTasks(new Map());
    showToast('Gallery cleared', 'info');
  }, [showToast]);

  const value: TaskManagerContextType = {
    tasks,
    getRandomPrompt,
    createWorkflow,
    createVideoWorkflow,
    submitTask,
    submitVaceControlVideoTask,
    submitInfiniteTalkTask,
    submitT2VTask,
    submitI2VTask,
    monitorTask,
    loadExistingTasks,
    clearGallery
  };

  return (
    <TaskManagerContext.Provider value={value}>
      {children}
    </TaskManagerContext.Provider>
  );
};