export default function IssuesTableSkeleton() {
    return (
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th className="text-xl">Issue</th>
              <th className="text-xl hidden md:table-cell">Status</th>
              <th className="text-xl hidden md:table-cell">Created</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td><div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div></td>
                <td className="hidden md:table-cell"><div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div></td>
                <td className="hidden md:table-cell"><div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }