export enum TaskPriority{
    LOW = 'Low',
    MEDIUM = "Medium",
    HIGH = "High",
    URGENT = "Urgent"
}

export enum TaskStatus{
    TODO = "To Do",
    IN_PROGRESS = "In Progress",
    REVIEW = "Review",
    COMPLETED = "Completed"
}

export interface ITask{
    title: string,
    description: string,
    dueDate: Date,
    priority: TaskPriority,
    status: TaskStatus,
    createdId: any,
    assignedTo: any
}