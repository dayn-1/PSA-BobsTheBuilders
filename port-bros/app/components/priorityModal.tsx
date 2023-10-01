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

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<PriorityItem[]>([
    { name: "Transhipment", score: 5 },
    { name: "Vessel Waiting Time", score: 5 },
    { name: "Berth Utilisation", score: 5 },
    { name: "Vessel Turnaround", score: 5 },
    { name: "Berth Changeovers", score: 5 },
  ]);

  const handleScoreChange = (index: number, newScore: number) => {
    const newData = [...data];
    newData[index].score = newScore;
    setData(newData);
  };

  const handleRegenerateButton = async () => {
    console.log("pressed");
    setIsLoading(true);
    const trans = data[0].score;
    const waiting = data[1].score;
    const util = data[2].score;
    const turnaround = data[3].score;
    const changeover = data[4].score;

    // Construct the URL with query parameters
    const apiUrl = `/api/algo?trans=${trans}&waiting=${waiting}&util=${util}&turnaround=${turnaround}&changeover=${changeover}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const responseData = await response.json();
      // Handle the response data

      console.log("Optimized Solution:", responseData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Set isLoading to false when the API call is completed
    }
  };

  if (!visible) return null;
  return (
    <main>
      <div
        id="outside"
        className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center cursor-pointer"
        // onClick={() => onClose()}
        style={{ zIndex: 999 }}
      >
        <div className="sm:m-80 border-8 mx-8 rounded-3xl bg-gray-300/80 cursor-default h-[700px] sm:w-full">
          <div>
            <h1 className="text-xl my-6 font-medium justify-center items-center flex">
              {" "}
              Priority Weightage{" "}
            </h1>
            {data.map((item, index) => (
              <div key={index} className="flex flex-row justify-center my-4">
                <h2 className="text-xl mx-16 items-center flex w-64">
                  {item.name}
                </h2>
                <select
                  className="text-xl bg-white shadow-2xl items-center justify-center flex w-20 border-2 border-black outline-none focus:border-indigo-600 text-center h-11"
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
            <h1 className="text-xl my-6 font-medium justify-center items-center flex">
              Hard Constraints{" "}
            </h1>
            <div className="flex flex-row justify-center my-4 text-xl">
              <h2 className="mx-16 items-center flex w-64">Berth Size</h2>
              <div className="flex justify-center items-center text-red-700">
                Must be Met
              </div>
            </div>
          </div>
          <div className="my-12">
            <div
              className="cursor-pointer flex justify-center items-center bg-red-700 text-white mx-64 text-xl rounded-3xl h-10 hover:bg-red-500 my-4"
              onClick={() => handleRegenerateButton()}
            >
              Regenerate Plan
            </div>
            <div className="items-center flex justify-center">
              {isLoading && (
                <div className="loading-screen">
                  <p>Loading...</p>
                </div>
              )}
            </div>
            <div
              className="cursor-pointer flex justify-center items-center bg-green-700 text-white mx-64 text-xl rounded-3xl h-10 hover:bg-green-500"
              onClick={() => onClose()}
            >
              Confirm
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
