
import { Agent, Task, LogEntry, Project } from './types';
import { 
  REAL_AGENTS_COMPANY, 
  REAL_LOGS_COMPANY, 
  REAL_TASKS_COMPANY,
  REAL_PROJECTS_COMPANY,
  REAL_AGENTS_PRIVATE,
  REAL_TASKS_PRIVATE,
  REAL_LOGS_PRIVATE,
  REAL_PROJECTS_PRIVATE
} from './realData';

// Use REAL data for company
export const MOCK_AGENTS_COMPANY: Agent[] = REAL_AGENTS_COMPANY;
export const MOCK_PROJECTS_COMPANY: Project[] = REAL_PROJECTS_COMPANY;
export const MOCK_TASKS_COMPANY: Task[] = REAL_TASKS_COMPANY;
export const MOCK_LOGS_COMPANY: LogEntry[] = REAL_LOGS_COMPANY;

// Use REAL data for private
export const MOCK_PROJECTS_PRIVATE: Project[] = REAL_PROJECTS_PRIVATE;
export const MOCK_AGENTS_PRIVATE: Agent[] = REAL_AGENTS_PRIVATE;
export const MOCK_TASKS_PRIVATE: Task[] = REAL_TASKS_PRIVATE;
export const MOCK_LOGS_PRIVATE: LogEntry[] = REAL_LOGS_PRIVATE;

export const SCOPED_DATA = {
  COMPANY: {
    agents: MOCK_AGENTS_COMPANY,
    tasks: MOCK_TASKS_COMPANY,
    logs: MOCK_LOGS_COMPANY,
    projects: MOCK_PROJECTS_COMPANY,
    stats: { chiefs: 1, agents: 12, active: 12, scaffolded: 0, deprecated: 0, spend: 0.50 }
  },
  PRIVATE: {
    agents: MOCK_AGENTS_PRIVATE,
    tasks: MOCK_TASKS_PRIVATE,
    logs: MOCK_LOGS_PRIVATE,
    projects: MOCK_PROJECTS_PRIVATE,
    stats: { chiefs: 1, agents: 1, active: 1, scaffolded: 0, deprecated: 0, spend: 0.05 }
  }
};
