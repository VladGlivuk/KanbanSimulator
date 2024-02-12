module.exports = {
  columns: [
    { id: 'column1', title: 'To Do' },
    { id: 'column2', title: 'In Progress' },
    { id: 'column3', title: 'Done' },
  ],
  tasks: [
    { id: 'task1', title: 'Task 1', columnId: 'column1', createdAt: new Date('2021-12-14') },
    { id: 'task2', title: 'Task 2', columnId: 'column1', createdAt: new Date('2023-12-14') },
    { id: 'task3', title: 'Task 3', columnId: 'column2', createdAt: new Date('2020-12-14') },
    { id: 'task4', title: 'Task 4', columnId: 'column3', createdAt: new Date('2024-12-14') },
  ],
};
