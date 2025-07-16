export default function ReflectionSubmission() {
  return (
    <form className="space-y-4">
      <textarea name="reflection" placeholder="Enter your reflection..." className="w-full p-2 border rounded" />
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}