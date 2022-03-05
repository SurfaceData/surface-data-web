import {parse, stringify} from 'bcp-47';
import {iso6393} from 'iso-639-3';

import type { LanguageDisplay } from '@features/language';

const cldrLanguagesList: Array<LanguageDisplay> = [];
const allLanguagesList: Array<LanguageDisplay> = [];

// To create our LanguageDisplay values we read all possible ISO 639-3
// languages and match them with their CLDR name when one exists. CLDR does not
// always have an in-language name so we also preserve the English based ISO
// name.
//
// In all cases we use the ISO 639-3 three letter language code.
iso6393.forEach( (code) => {
  // Intl gives us the CLDR based language name if it exists.
  const displayName = new Intl.DisplayNames(code.iso6393, {type: 'language'});
  const bcpSchema = parse(code.iso6393);
  const isoCode = code.iso6393;
  const intlName = displayName.of(code.iso6393);
  const isoName = code.name;
  const langDisplay = {
    isoCode: isoCode,
    isoName: isoName,
    cldrName: intlName,
    cldrSupported: intlName !== isoCode
  } as LanguageDisplay;
  allLanguagesList.push(langDisplay);
  if (langDisplay.cldrSupported) {
    cldrLanguagesList.push(langDisplay);
  }
});

export let allLanguages = allLanguagesList;
export let cldrLanguages = cldrLanguagesList;
