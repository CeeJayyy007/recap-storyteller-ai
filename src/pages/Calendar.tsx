const Calendar = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold mb-4">Your Calendar</h2>
        <p className="text-muted-foreground">
          Schedule and manage your events here.
        </p>
        {/* Add your calendar UI here */}
      </div>
    </div>
  );
};

export default Calendar;
