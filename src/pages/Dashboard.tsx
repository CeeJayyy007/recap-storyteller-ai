const Dashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Welcome Back!</h2>
          <p className="text-muted-foreground">
            This is your dashboard overview.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <p className="text-muted-foreground">Your productivity metrics.</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">Latest updates and changes.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
