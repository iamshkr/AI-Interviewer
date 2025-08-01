'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function Question() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');

  // Hardcoded list of CSV files in public/data/companies
  const companyFiles = [
    'google_1year.csv',
    'google_2year.csv',
    'adobe_1year.csv',
    'affirm_alltime.csv',
    'airbnb_2year.csv',
    'airtel_1year.csv',
    'amazon_1year.csv',
    'atlassian_1year.csv',
    'bloomberg_1year.csv',
    'byjus_1year.csv',
    'cisco_1year.csv',
    'cleartax_1year.csv',
    'de_shaw_1year.csv',
    'dell_1year.csv',
    'deshaw_2year.csv',
    'dunzo_1year.csv',
    'expedia_1year.csv',
    'flipkart_1year.csv',
    'goldman_1year.csv',
    'groww_1year.csv',
    'infosys_1year.csv',
    'jpmorgan_1year.csv',
    'kreditbee_1year.csv',
    'linkedin_1year.csv',
    'lti_1year.csv',
    'microsoft_1year.csv',
    'mindtree_1year.csv',
    'morganstanley_1year.csv',
    'myntra_1year.csv',
    'nagarro_1year.csv',
    'nvidia_1year.csv',
    'ola_1year.csv',
    'oracle_1year.csv',
    'oyo_1year.csv',
    'paypal_1year.csv',
    'persistent_1year.csv',
    'postman_1year.csv',
    'qualcomm_1year.csv',
    'qplum_1year.csv',
    'reliance_1year.csv',
    'robertbosch_1year.csv',
    'salesforce_1year.csv',
    'samsung_1year.csv',
    'sap_1year.csv',
    'siemens_1year.csv',
    'sprinklr_1year.csv',
    'swiggy_1year.csv',
    'synopsys_1year.csv',
    'tcs_1year.csv',
    'tekion_1year.csv',
    'tesla_1year.csv',
    'uber_1year.csv',
    'vedantu_1year.csv',
    'vmware_1year.csv',
    'walmart_1year.csv',
    'wellsfargo_1year.csv',
    'wipro_1year.csv',
    'yatra_1year.csv',
    'zomato_1year.csv',
  ];

  useEffect(() => {
    if (!searchTerm) {
      setFilteredFiles([]);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const matches = companyFiles.filter((file) =>
      file.toLowerCase().includes(lower)
    );
    setFilteredFiles(matches);
  }, [searchTerm]);

  const handleFileClick = (file) => {
    setSearchTerm(file);
    setFilteredFiles([]);
    setSelectedFile(file);
  };

  const handleShowQuestions = () => {
    if (!selectedFile) return;

    fetch(`/data/companies/${selectedFile}`)
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setQuestions(results.data);
          },
        });
      });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4"> DSA Questions by Company</h1>

      <input
        type="text"
        placeholder="Search company file (e.g., google_1year.csv)..."
        className="p-2 border border-gray-300 w-full rounded mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredFiles.length > 0 && (
        <ul className="border rounded bg-white max-h-60 overflow-y-auto mb-2 shadow">
          {filteredFiles.map((file, idx) => (
            <li
              key={idx}
              onClick={() => handleFileClick(file)}
              className="cursor-pointer px-3 py-2 hover:bg-blue-100"
            >
              {file}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleShowQuestions}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Show Questions
      </button>

      {questions.length > 0 && (
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Title</th>
              <th className="border px-2 py-1">Acceptance</th>
              <th className="border px-2 py-1">Difficulty</th>
              <th className="border px-2 py-1">Frequency</th>
              <th className="border px-2 py-1">Leetcode Link</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{q.ID}</td>
                <td className="border px-2 py-1">{q.Title}</td>
                <td className="border px-2 py-1">{q.Acceptance}</td>
                <td className="border px-2 py-1">{q.Difficulty}</td>
                <td className="border px-2 py-1">
                  {Number(q.Frequency).toFixed(2)}
                </td>
                <td className="border px-2 py-1">
                  <a
                    href={q['Leetcode Question Link']}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Link
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
