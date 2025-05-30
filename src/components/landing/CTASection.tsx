
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Ready to Start?
          </h2>
          <p className="text-lg text-gray-600">
            Get an instant access and download now
          </p>
          
          <div className="flex justify-center space-x-4 mb-8">
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-700 rounded mb-2 flex items-center justify-center">
                <span className="text-white text-xs">PC</span>
              </div>
              <span className="text-sm text-gray-600">PC</span>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-700 rounded mb-2 flex items-center justify-center">
                <span className="text-white text-xs">Mac</span>
              </div>
              <span className="text-sm text-gray-600">Mac</span>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-700 rounded mb-2 flex items-center justify-center">
                <span className="text-white text-xs">Web</span>
              </div>
              <span className="text-sm text-gray-600">Web</span>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium"
          >
            Download Now
          </Button>
        </div>
      </div>
    </section>
  );
};
