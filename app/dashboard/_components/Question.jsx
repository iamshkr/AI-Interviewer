
// 'use client';

// import React, { useState, useEffect } from 'react';
// import Papa from 'papaparse';

// export default function Question() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredFiles, setFilteredFiles] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [selectedFile, setSelectedFile] = useState('');

  
//   const [companyFiles, setCompanyFiles] = useState([]);

  
//   useEffect(() => {
//     fetch('/api/get-files')
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) {
//           setCompanyFiles(data);
//         }
//       })
//       .catch((error) => console.error('Failed to fetch company files:', error));
//   }, []); 

  
//   useEffect(() => {
//     if (!searchTerm) {
//       setFilteredFiles([]);
//       return;
//     }

//     const lower = searchTerm.toLowerCase();
//     const matches = companyFiles.filter((file) =>
//       file.toLowerCase().includes(lower)
//     );
//     setFilteredFiles(matches);
//   }, [searchTerm, companyFiles]);

//   const handleFileClick = (file) => {
//     setSearchTerm(file);
//     setFilteredFiles([]);
//     setSelectedFile(file);
//   };

//   const handleShowQuestions = () => {
//     if (!selectedFile) return;

//     fetch(`/data/companies/${selectedFile}`)
//       .then((res) => res.text())
//       .then((csvText) => {
//         Papa.parse(csvText, {
//           header: true,
//           skipEmptyLines: true,
//           complete: (results) => {
//             setQuestions(results.data);
//           },
//         });
//       });
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4"> DSA Questions by Company</h1>

//       <input
//         type="text"
//         placeholder="Search company file..."
//         className="p-2 border border-gray-300 w-full rounded mb-2"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       {filteredFiles.length > 0 && (
//         <ul className="border rounded bg-white max-h-60 overflow-y-auto mb-2 shadow">
//           {filteredFiles.map((file, idx) => (
//             <li
//               key={idx}
//               onClick={() => handleFileClick(file)}
//               className="cursor-pointer px-3 py-2 hover:bg-blue-100"
//             >
//               {file}
//             </li>
//           ))}
//         </ul>
//       )}

//       <button
//         onClick={handleShowQuestions}
//         className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Show Questions
//       </button>

//       {questions.length > 0 && (
//         <table className="w-full table-auto border border-gray-300 text-sm">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border px-2 py-1">ID</th>
//               <th className="border px-2 py-1">Title</th>
//               <th className="border px-2 py-1">Acceptance</th>
//               <th className="border px-2 py-1">Difficulty</th>
//               <th className="border px-2 py-1">Frequency</th>
//               <th className="border px-2 py-1">Leetcode Link</th>
//             </tr>
//           </thead>
//           <tbody>
//             {questions.map((q, idx) => (
//               <tr key={idx} className="hover:bg-gray-50">
//                 <td className="border px-2 py-1">{q.ID}</td>
//                 <td className="border px-2 py-1">{q.Title}</td>
//                 <td className="border px-2 py-1">{q.Acceptance}</td>
//                 <td className="border px-2 py-1">{q.Difficulty}</td>
//                 <td className="border px-2 py-1">
//                   {Number(q.Frequency).toFixed(2)}
//                 </td>
//                 <td className="border px-2 py-1">
//                   <a
//                     href={q['Leetcode Question Link']}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 underline"
//                   >
//                     Link
//                   </a>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  Search,
  ChevronRight,
  Link as LinkIcon,
  Loader,
  AlertCircle,
} from 'lucide-react';

export default function Question() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [companyFiles, setCompanyFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/get-files')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCompanyFiles(data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch company files:', err);
        setError('Could not load company files. Please try again later.');
      });
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredFiles([]);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const matches = companyFiles.filter((file) =>
      file.toLowerCase().replace(/_/g, ' ').includes(lower)
    );
    setFilteredFiles(matches);
  }, [searchTerm, companyFiles]);

  const handleFileClick = (file) => {
    setSearchTerm(file.replace(/_/g, ' ').replace('.csv', ''));
    setSelectedFile(file);
    setFilteredFiles([]);
  };

  const handleShowQuestions = () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setQuestions([]);
    setError(null);

    fetch(`/data/companies/${selectedFile}`)
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setQuestions(results.data);
            setIsLoading(false);
          },
        });
      })
      .catch((err) => {
        console.error('Failed to fetch questions:', err);
        setError('Failed to load questions for the selected company.');
        setIsLoading(false);
      });
  };

  return (
    <div className="">
      {/* Main container */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Company-Wise Questions
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Search for a company to find frequently asked interview questions.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center shadow-lg rounded-full bg-white overflow-hidden border border-gray-200 focus-within:border-indigo-600 transition-colors">
            <Search className="h-6 w-6 text-gray-400 mx-4" />
            <input
              type="text"
              placeholder="Search for a company (e.g., Google, Amazon)..."
              className="p-4 w-full text-lg border-0 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleShowQuestions}
              className="bg-indigo-600 text-white px-6 py-4 rounded-full m-1 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
              disabled={!selectedFile || isLoading}
            >
              <span className="hidden sm:inline">Search</span>
              <ChevronRight className="h-6 w-6 sm:hidden" />
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {filteredFiles.length > 0 && (
            <ul className="absolute z-10 w-full mt-2 border rounded-lg bg-white shadow-xl max-h-72 overflow-y-auto">
              {filteredFiles.map((file, idx) => (
                <li
                  key={idx}
                  onClick={() => handleFileClick(file)}
                  className="cursor-pointer px-5 py-3 text-gray-700 hover:bg-indigo-50 flex items-center justify-between"
                >
                  <span>{file.replace(/_/g, ' ').replace('.csv', '')}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Results Area */}
        <div className="mt-12">
          {isLoading && (
            <div className="flex justify-center items-center p-10">
              <Loader className="h-12 w-12 text-indigo-600 animate-spin" />
              <p className="ml-4 text-lg text-gray-600">Loading Questions...</p>
            </div>
          )}

          {error && (
            <div
              className="max-w-md mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md"
              role="alert"
            >
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 mr-3" />
                <div>
                  <p className="font-bold">An Error Occurred</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {questions.length > 0 && (
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">
                      Title
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">
                      Difficulty
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase text-center">
                      Acceptance
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase text-center">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {questions.map((q, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-500 font-mono">
                        {q.ID}
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {q.Title}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            q.Difficulty === 'Easy'
                              ? 'bg-green-100 text-green-800'
                              : q.Difficulty === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {q.Difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-center">
                        {q.Acceptance}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a
                          href={q['Leetcode Question Link']}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 transition-colors"
                          title="View on LeetCode"
                        >
                          <LinkIcon className="h-5 w-5 mx-auto" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
