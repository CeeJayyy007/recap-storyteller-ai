const Tasks = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        <p className="text-muted-foreground">
          Manage your tasks and to-dos here.
        </p>
        {/* Add your task management UI here */}
      </div>
    </div>
  );
};

export default Tasks;
