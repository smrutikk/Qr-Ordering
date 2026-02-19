import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

const API = "http://localhost:5000";

export default function AdminTables() {
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState("");

  const restaurantId = 1; // temporary (later from auth)

  const fetchTables = async () => {
    try {
      const res = await axios.get(`${API}/tables/${restaurantId}`);
      setTables(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createTable = async () => {
    if (!tableNumber) return;

    try {
      await axios.post(`${API}/table/create`, {
        restaurant_id: restaurantId,
        table_number: tableNumber,
      });

      setTableNumber("");
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTable = async (id) => {
    try {
      await axios.delete(`${API}/table/${id}`);
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  const downloadQR = (tableId) => {
    const canvas = document.getElementById(`qr-${tableId}`);
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `table-${tableId}-qr.png`;
    link.click();
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Table QR Management</h1>

      {/* Create Table */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-3">
        <input
          type="number"
          placeholder="Enter table number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="border p-2 rounded-lg flex-1"
        />
        <button
          onClick={createTable}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Table
        </button>
      </div>

      {/* Table List */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tables.map((table) => {
          const qrValue = `${window.location.origin}/?restaurant=${restaurantId}&table=${table.id}`;

          return (
            <div
              key={table.id}
              className="bg-white p-5 rounded-2xl shadow border"
            >
              <h2 className="text-lg font-semibold mb-3">
                Table {table.table_number}
              </h2>

              <div className="flex justify-center mb-4">
                <QRCodeCanvas
                  id={`qr-${table.id}`}
                  value={qrValue}
                  size={180}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadQR(table.id)}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm flex-1"
                >
                  Download QR
                </button>

                <button
                  onClick={() => deleteTable(table.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
