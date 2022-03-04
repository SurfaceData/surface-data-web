import {parse, stringify} from 'bcp-47';
import {iso6393} from 'iso-639-3';
import type { NextApiRequest, NextApiResponse } from 'next';
import TrieSearch from 'trie-search';

import type { LanguageDisplay } from '@features/language';

interface RequestParams {
  // A comma separated list of language queries.
  // Default Value: empty
  languages?: string,
  // When true, `languages` and `useCodes` are ignored and all CLDR languages
  // are returned.
  // Default Value: true
  cldr?: Boolean,
  // When true, only returns matches based on language codes.
  // Default Value: false
  useCodes?: Boolean
}

// Prepare the fixed data that will live in memory.  We create a few
// structures:
//
// 1) A prefix trie mapping language codes to LanguagDisplays.
const codeTrie = new TrieSearch([], {splitOnRegEx: false});
// 2) A prefix trie mapping language names (either CLDR or ISO based) to
// LanguagDisplays.
const nameTrie = new TrieSearch([], {splitOnRegEx: false});
// 3) An array of CLDR only LanguageDisplays.
const cldrLanguages = [];

// To create our LanguageDisplay values we read all possible ISO 639-3
// languages and match them with their CLDR name when one exists. CLDR does not
// always have an in-language name so we also preserve the English based ISO
// name.
//
// In all cases we use the ISO 639-3 three letter language code.
iso6393.forEach ( (code) => {
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
  };
  // Store the object in the appropriate mappings.
  codeTrie.map(isoCode, langDisplay);
  nameTrie.map(isoName, langDisplay);
  if (langDisplay.cldrSupported) {
    cldrLanguages.push(langDisplay);
    if (intlName !== isoName) {
      nameTrie.map(intlName, langDisplay);
    }
  }
});

// I don't fully understand how to work with NextJS request objects.  This is a
// hack to ensure boolean params are returned correctly.  The more intuitive
// conversions all do the wrong thing.
const getBoolParam = (param, defaultValue) => {
  if (param === undefined) {
    return defaultValue;
  }
  if (param === "true") {
    return true;
  }
  return false;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Array<LanguageDisplay>>
) => {
  // Pre-process the query params.
  const params = req.query as RequestParams;

  const languageQueries: Array<string> = params.languages?
    params.languages.split(',') : [];
  const cldr = getBoolParam(params.cldr, true);
  const useCodes = getBoolParam(params.useCodes, false);

  // Get all matching languages.
  const languages = findAllLanguages(languageQueries, cldr, useCodes);
  res.status(200).json(languages);
}

// Returns the matching languages as described above.
const findAllLanguages = (
  languageQueries,
  cldr: boolean,
  useCodes
) => {
  if (cldr) {
    return cldrLanguages;
  }
  if (useCodes) {
    languageQueries.flatMap( (code) => codeTrie.search(code));
  }
  return languageQueries.flatMap( (query) => nameTrie.search(query));
}
