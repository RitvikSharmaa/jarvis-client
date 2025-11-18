export default function SurveyPopup({ onFill, onSkip }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white p-5 rounded-xl shadow-xl border w-[90%] max-w-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Before you go…
      </h3>
      <p className="text-gray-600 mb-4">
        Would you like to fill a quick feedback survey?
      </p>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onSkip}
          className="px-4 py-2 bg-gray-300 rounded-lg text-gray-800"
        >
          Skip
        </button>

        <button
          onClick={onFill}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Fill Survey
        </button>
      </div>
    </div>
  );
}
