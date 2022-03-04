import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { FilteredCombobox } from '@components/ui/FilteredCombobox';

export default {
  title: 'Surface/FilteredCombobox',
  component: FilteredCombobox,
} as ComponentMeta<typeof FilteredCombobox>;

const items = [
  { name: 'English' },
  { name: 'French' },
  { name: 'Spanish' },
  { name: 'Italian' }
];
export const Default = () => (
  <FilteredCombobox 
    label="Language"
    placeholder="Search for your language"
    items={items}
    itemToName={ (item) => item.name }
    itemToKey={ (item) => item.name }
    filterItems={ (inputValue) => {
      return new Promise( (done) => {
        setTimeout(() => {
          const query = inputValue.toLowerCase();
          const newItems = items.filter(
            (item) => item.name.toLowerCase().startsWith(query));
          done(newItems);
        }, 1000);
      });
    }}
  />
);
