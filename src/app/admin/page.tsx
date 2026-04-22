export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-neutral-500 mt-2">Manage KinderCloud students, teachers, classes, and finances.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700">
          <h2 className="text-xl font-semibold mb-2">Total Students</h2>
          <p className="text-4xl font-black text-blue-500">142</p>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700">
          <h2 className="text-xl font-semibold mb-2">Active Teachers</h2>
          <p className="text-4xl font-black text-emerald-500">12</p>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700">
          <h2 className="text-xl font-semibold mb-2">Net Balance</h2>
          <p className="text-4xl font-black text-purple-500">$4,250</p>
        </div>
      </div>

      <div className="p-8 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 mt-8">
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-neutral-700">
            <span className="font-medium">Ms. Sarah recorded attendance</span>
            <span className="text-sm text-neutral-500">2 mins ago</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-neutral-700">
            <span className="font-medium">New Student "Leo" registered</span>
            <span className="text-sm text-neutral-500">1 hour ago</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-neutral-100 dark:border-neutral-700">
            <span className="font-medium">Term Tuition Income</span>
            <span className="text-sm text-neutral-500">+ $500</span>
          </div>
        </div>
      </div>
    </div>
  );
}
