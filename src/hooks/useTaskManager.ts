import { useState, useCallback } from 'react';
import { TaskData, ApiTaskResponse, Workflow, TaskSubmissionResponse, TasksResponse } from '../types';

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

export const useTaskManager = (schedulerUrl: string, showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void) => {
  const [tasks, setTasks] = useState<Map<string, TaskData>>(new Map());

  // Get random prompt
  const getRandomPrompt = useCallback((): string => {
    return RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
  }, []);

  // Create workflow from prompt
  const createWorkflow = useCallback(async (prompt: string): Promise<Workflow> => {
    try {
      const response = await fetch('/default_workflow.json');
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
      }
    }
    
    return 'Generated image';
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
  const submitTask = useCallback(async (workflow: Workflow, prompt: string): Promise<TaskSubmissionResponse> => {
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
  }, [schedulerUrl]);

  // Handle task completion
  const handleTaskCompleted = useCallback((taskData: TaskData) => {
    setTasks(prev => new Map(prev.set(taskData.id, taskData)));
    showToast(`Task completed: ${taskData.id}`, 'success');
  }, [showToast]);

  // Handle task failure
  const handleTaskFailed = useCallback((taskData: TaskData) => {
    setTasks(prev => new Map(prev.set(taskData.id, taskData)));
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

  // Update task status
  const updateTaskStatus = useCallback((taskData: TaskData) => {
    setTasks(prev => new Map(prev.set(taskData.id, taskData)));
  }, []);

  // Monitor task progress
  const monitorTask = useCallback(async (taskId: string, prompt: string) => {
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
          
          setTasks(prev => new Map(prev.set(taskId, updatedTaskData)));
          
          if (apiTask.status === 'completed') {
            handleTaskCompleted(updatedTaskData);
          } else if (apiTask.status === 'failed' || apiTask.status === 'timeout') {
            handleTaskFailed(updatedTaskData);
          } else {
            // Update status for intermediate states (processing, running, etc.)
            updateTaskStatus(updatedTaskData);
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
  }, [schedulerUrl, handleTaskCompleted, handleTaskFailed, addPendingTask, updateTaskStatus, mapApiTaskToTaskData]);

  // Load existing tasks
  const loadExistingTasks = useCallback(async () => {
    try {
      const response = await fetch(`${schedulerUrl}/api/v1/tasks`);
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
  }, [schedulerUrl, mapApiTaskToTaskData, showToast]);

  // Clear gallery
  const clearGallery = useCallback(() => {
    setTasks(new Map());
    showToast('Gallery cleared', 'info');
  }, [showToast]);

  return {
    tasks,
    getRandomPrompt,
    createWorkflow,
    submitTask,
    monitorTask,
    loadExistingTasks,
    clearGallery
  };
};