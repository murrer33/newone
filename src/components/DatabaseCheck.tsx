import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface TableStatus {
  name: string;
  exists: boolean;
  error: string | null;
}

const requiredTables = [
  'users',
  'feedbacks',
  'quests',
  'plans',
  'subscriptions'
];

const DatabaseCheck: React.FC = () => {
  const [tableStatus, setTableStatus] = useState<TableStatus[]>([]);
  const [checking, setChecking] = useState(true);
  const [allTablesExist, setAllTablesExist] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkTables = async () => {
      setChecking(true);
      
      const statuses = await Promise.all(
        requiredTables.map(async (tableName) => {
          try {
            const { count, error } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true });
              
            return {
              name: tableName,
              exists: !error,
              error: error ? error.message : null
            };
          } catch (err) {
            return {
              name: tableName,
              exists: false,
              error: err instanceof Error ? err.message : 'Unknown error'
            };
          }
        })
      );
      
      setTableStatus(statuses);
      setAllTablesExist(statuses.every(status => status.exists));
      setChecking(false);
    };
    
    checkTables();
  }, []);

  if (checking) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-md shadow-md">
        <p className="font-bold flex items-center">
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Checking database tables...
        </p>
      </div>
    );
  }

  if (!allTablesExist) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-md z-50">
        <div className="flex">
          <div className="py-1">
            <svg className="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-bold">Database tables are missing!</p>
            <p className="text-sm">
              Your application may not work properly. Please set up the required tables.
            </p>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
            
            {showDetails && (
              <div className="mt-3 text-sm">
                <p className="font-bold">Missing tables:</p>
                <ul className="list-disc pl-5 mt-1">
                  {tableStatus
                    .filter(table => !table.exists)
                    .map(table => (
                      <li key={table.name}>
                        {table.name} - {table.error}
                      </li>
                    ))}
                </ul>
                <p className="mt-2">
                  Please use the SQL provided in <span className="font-mono bg-gray-200 px-1 rounded">supabase-tables.sql</span> to set up your database.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DatabaseCheck; 