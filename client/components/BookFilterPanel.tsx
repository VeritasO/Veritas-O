import React, { useState } from 'react';
import { Select } from '@/components/ui/select';

type Filters = {
  tier: string;
  griefStage: string;
  symbolicClass: string;
};

export function BookFilterPanel({ filters, setFilters }) {
  return (
    <div className="grid grid-cols-3 gap-2 p-2">
      <select onChange={e => setFilters(f => ({ ...f, tier: e.target.value }))}>
        <option value="">All Tiers</option>
        <option value="I">Tier I</option>
        <option value="II">Tier II</option>
        <option value="III">Tier III</option>
      </select>
      <select onChange={e => setFilters(f => ({ ...f, griefStage: e.target.value }))}>
        <option value="">All Grief Stages</option>
        <option value="denial">Denial</option>
        <option value="acceptance">Acceptance</option>
      </select>
      <select onChange={e => setFilters(f => ({ ...f, symbolicClass: e.target.value }))}>
        <option value="">All Classes</option>
        <option value="mourning">Mourning</option>
        <option value="reconciliation">Reconciliation</option>
      </select>
    </div>
  );
}