export const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-6 transition-all duration-300">
          <span className="text-white font-bold text-xl font-space">R</span>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
      </div>
    </div>
  );
};
