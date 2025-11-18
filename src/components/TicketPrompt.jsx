export default function TicketPrompt({ onRaiseTicket }) {
  return (
    <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md text-sm mt-4 flex justify-between items-center">
      <span>💡 Would you like to raise a support ticket for this issue?</span>
      <button
        onClick={onRaiseTicket}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md ml-3"
      >
        Raise Ticket
      </button>
    </div>
  );
}
