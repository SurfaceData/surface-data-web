import styled from 'styled-components';
import { useEffect, useState } from 'react';

import { FilteredCombobox } from '@components/ui/FilteredCombobox';
import type { LanguageDisplay } from '@features/language';
import type { LanguageTasks } from '@features/tasks';
import { useIsMounted } from '@hooks/useIsMounted';

interface LanguageComboboxProps {
  locale: LanguageTasks,
  languageIndex: number,
  allLanguages: LanguageTasks[],
  cldrlanguages: LanguageDisplay[],
  setUserLanguages: (locale: LanguageTasks[]) => void;
}
export const LanguageCombobox = ({
  locale,
  languageIndex,
  allLanguages,
  cldrlanguages,
  setUserLanguages,
}:LanguageComboboxProps) => {
  const isMounted = useIsMounted();

  const handleLanguageSelection = (language: LanguageDisplay) => {
    const newLanguages = allLanguages.slice();
    newLanguages[languageIndex] = {
      language: language.isoCode,
      languageDisplay: language,
      tasks: [],
    } as LanguageTasks;
    setUserLanguages(newLanguages);
  };

  return (
    <FilteredCombobox
      label="Language"
      placeholder="Search for your language"
      items={cldrlanguages}
      itemToName={ (item) => {
        if (!item) {
          return '';
        }
        return item.cldrSupported ? item.cldrName : item.isoName;
      }}
      itemToKey={ (item) => item.isoCode }
      selectedItem={locale.languageDisplay}
      filterItems={ (inputValue) => {
        if (inputValue === '') {
          return new Promise( (done) => {
            if (isMounted.current) {
              done(cldrlanguages);
            }
          });
        }
        return new Promise( (done) => {
          fetch(`/api/languages?cldr=false&languages=${inputValue}`)
            .then((res) => res.json())
            .then((data) => {
              if (isMounted.current) {
                done(data);
              }
            });
        });
      }}
      onSelectedItemChange={ (language) => handleLanguageSelection(language)}
    />
  );
};
