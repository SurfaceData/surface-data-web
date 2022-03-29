import {parse, stringify} from 'bcp-47';
import {iso6393} from 'iso-639-3';

import type { LanguageDisplay } from '@features/language';

const cldrLanguages: Array<LanguageDisplay> = [];
const allLanguages: Array<LanguageDisplay> = [];

// To create our LanguageDisplay values we read all possible ISO 639-3
// languages and match them with their CLDR name when one exists. CLDR
// does not always have an in-language name so we also preserve the
// English based ISO name.
//
// In all cases we use the ISO 639-3 three letter language code.
iso6393.forEach( (code) => {
  // Intl gives us the CLDR based language name if it exists.
  const displayName = new Intl.DisplayNames(code.iso6393, {type: 'language'});
  const isoCode = code.iso6393;
  const intlName = displayName.of(code.iso6393);
  const isoName = code.name;
  const cldrSupported = intlName  !== isoCode;
  const langDisplay = {
    isoCode: isoCode,
    isoName: isoName,
    cldrName: intlName,
    cldrSupported: cldrSupported,
  } as LanguageDisplay;
  allLanguages.push(langDisplay);
  if (langDisplay.cldrSupported) {
    cldrLanguages.push(langDisplay);
  }
});

export { allLanguages, cldrLanguages };
