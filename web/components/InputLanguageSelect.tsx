import styled from 'styled-components';

import { LabeledSelect } from '@components/ui/LabeledSelect';

const LANGUAGE_NAMES = require('@common/language-names.json') as {
  [key: string]: string;
};

const Container = styled.div`
  margin: 48px 24px;
  text-align: center;
`;

const Input = styled.input`
  padding: 5px 12px;
  font-size: 14px;
  line-height: 20px;
  vertical-align: middle;
  border-radius: 6px;
  outline: none;
`;


interface InputLanguageSelectProps {
  locale: string,
  languageIndex: number,
  allLanguages: string[],
  setUserLanguages: (locale: string[]) => void;
}

const InputLanguageSelect = ({
  locale,
  languageIndex,
  allLanguages,
  setUserLanguages,
}: InputLanguageSelectProps) => {
  const handleSelection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newLanguages = allLanguages.slice();
    newLanguages[languageIndex] = e.target.value;
    setUserLanguages(newLanguages);
  };

  return (
    <LabeledSelect
        label="Language"
        value={locale}
        onChange={handleSelection}>
      <option value="" />
        {Object.entries(LANGUAGE_NAMES).map(([localeOption, name]) => (
          <option key={localeOption} value={localeOption}>
            {name}
          </option>
        ))}
    </LabeledSelect>
  );
}

export default InputLanguageSelect;
