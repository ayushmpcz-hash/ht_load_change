import React, { useEffect, useState } from "react";
import axios from "axios";

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://htsanyojan.mpcz.in:8089/ht_load_change/reports/ht-load-change-payment/"
      );

      console.log(res.data, "API DATA"); // 🔥 check in console
      setData(res.data || []);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(); // page load par call
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reports</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {data.length > 0 &&
                Object.keys(data[0]).map((key) => (
                  <th key={key} className="border p-2">
                    {key}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((val, i) => (
                    <td key={i} className="border p-2">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-4">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reports;