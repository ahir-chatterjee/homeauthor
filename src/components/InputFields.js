// src/components/InputFields.js
import React from 'react';

const InputFields = ({ handleChange, params }) => {
  return (
    <div>
      <input type="text" placeholder="Database ID*" onChange={e => handleChange('databaseId', e.target.value)} required />
      <input type="text" placeholder="Listing ID*" onChange={e => handleChange('listingId', e.target.value)} required />
      <input type="number" placeholder="Word Count" onChange={e => handleChange('wordCount', e.target.value || null)} />
      <input type="text" placeholder="Favorable Words" onChange={e => handleChange('favorableWords', e.target.value || null)} />
      <input type="text" placeholder="Unfavorable Words" onChange={e => handleChange('unfavorableWords', e.target.value || null)} />
      <select onChange={e => handleChange('audience', e.target.value || null)} value={params.audience || ''}>
        <option value="">Select Audience</option>
        <option value="general audience">General Audience</option>
        <option value="single person">Single Person</option>
        <option value="married couple">Married Couple</option>
        <option value="small family">Small Family</option>
        <option value="large family">Large Family</option>
        <option value="investor">Investor</option>
      </select>
      <select onChange={e => handleChange('readingLevel', e.target.value || null)} value={params.readingLevel || ''}>
        <option value="">Select Reading Level</option>
        <option value="toddler level">Toddler Level</option>
        <option value="5th grade level">5th Grade Level</option>
        <option value="high school level">High School Level</option>
        <option value="college graduate level">College Graduate Level</option>
      </select>
    </div>
  );
};

export default InputFields;
