import React, { useState } from "react";

const suggestions = {
  mild: ["🌿 Light a candle for clarity.", "🌅 Write a sunrise letter to your future self."],
  moderate: ["🕊️ Offer an apology stone in a sacred place.", "🌧️ Water your grief into the soil with intent."],
  severe: ["🔥 Build a release fire circle.", "🌌 Spend a night in witness under the stars."]
};

const RitualSuggestionsPanel: React.FC = () => {
  const [tier, setTier] = useState<'mild' | 'moderate' | 'severe'>('mild');

  return (
    <section className="panel space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">🕯️ Symbolic Ritual Suggestions</h2>
      <p className="text-gray-700">Based on grief tier, emotional phase, or relational context.</p>
      <div>
        <label htmlFor="griefTier" className="block text-sm font-medium text-gray-700 mb-2">Grief Tier:</label>
        <select
          id="griefTier"
          value={tier}
          onChange={e => setTier(e.target.value as 'mild' | 'moderate' | 'severe')}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
      </div>
      <button
        className="submit-btn px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        onClick={() => {}}
        disabled
      >Suggest Ritual</button>
      <div id="ritualSuggestions" className="growth-log mt-4 space-y-2">
        {suggestions[tier].map((r, idx) => (
          <div key={idx} className="bg-purple-50 p-2 rounded text-purple-800">{r}</div>
        ))}
      </div>
    </section>
  );
};

export default RitualSuggestionsPanel;
