export const IssueDetailSkeleton = () => {
    return (
      <div className="card bg-base-100 shadow-md m-10 p-10 animate-pulse">
        <div className="card-body">
          <div className="p-5 flex grow flex-col gap-6 md:flex-row">
            {/* Left Side: Issue Details */}
            <div className="md:w-5/6">
              {/* Title */}
              <div className="h-8 w-3/4 bg-gray-300 rounded mb-4"></div>
              {/* Status and Date */}
              <div className="flex flex-row gap-5 my-2">
                <div className="h-6 w-20 bg-gray-300 rounded"></div>
                <div className="h-6 w-32 bg-gray-300 rounded"></div>
              </div>
              {/* Description Card */}
              <div className="card bg-base-100 shadow-md mt-5">
                <div className="card-body">
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-300 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                    <div className="h-4 w-4/6 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Right Side: Actions */}
            <div className="flex flex-col gap-4 md:w-1/6">
              {/* Assignee Select */}
              <div className="h-12 w-full bg-gray-300 rounded-lg"></div>
              {/* Edit Button */}
              <div className="h-12 w-full bg-gray-300 rounded-lg"></div>
              {/* Delete Button */}
              <div className="h-12 w-full bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };