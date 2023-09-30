import { useState } from "react";

interface priorityProps {
  visible: boolean;
  onClose: Function;
}

export default function PriorityModal({ visible, onClose }: priorityProps) {
  interface PriorityItem {
    name: string;
    score: number;
  }

  const [data, setData] = useState<PriorityItem[]>([
    { name: "Transhipment", score: 5 },
    { name: "Vessel Waiting Time", score: 7 },
    { name: "Berth Utilisation", score: 3 },
    { name: "Vessel Turnaround", score: 8 },
    { name: "Berth Changeovers", score: 8 },
  ]);

  const handleScoreChange = (index: number, newScore: number) => {
    const newData = [...data];
    newData[index].score = newScore;
    setData(newData);
  };

  if (!visible) return null;
  return (
    <main>
      <div
        id="outside"
        className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center cursor-pointer"
        onClick={() => onClose()}
        style={{ zIndex: 999 }}
      >
        <div className="sm:m-80 border-8 mx-8 rounded-3xl bg-gray-300/80 cursor-default h-[700px] sm:w-full">
          <div>
            <h1 className="text-2xl my-6 font-medium justify-center items-center flex">
              {" "}
              Priority Weightage{" "}
            </h1>
            {data.map((item, index) => (
              <div key={index} className="flex flex-row justify-center my-8">
                <h2 className="text-2xl mx-16 items-center flex w-64">
                  {item.name}
                </h2>
                <select
                  className="text-2xl bg-white shadow-2xl items-center justify-center flex w-20 border-2 border-black outline-none focus:border-indigo-600 text-center h-11"
                  value={item.score}
                  onChange={(e) =>
                    handleScoreChange(index, parseInt(e.target.value))
                  }
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-black">
            <h1 className="text-2xl my-6 font-medium justify-center items-center flex">
              Hard Constraints{" "}
            </h1>
            <div className="flex flex-row justify-center my-8 text-2xl">
              <h2 className="mx-16 items-center flex w-64">Berth Size</h2>
              <div className="flex justify-center items-center text-red-700">
                Must be Met
              </div>
            </div>
          </div>
          <div className="cursor-pointer flex justify-center items-center bg-green-700 text-white mx-80 text-2xl rounded-3xl h-10 hover:bg-green-500">
            Confirm
          </div>
        </div>
      </div>
    </main>
  );
}
