import Link from 'next/link';

import { Button } from '@components/ui/Button';
import type { LanguageDisplay } from '@features/language';
import type { TaskStats } from '@features/LanguageStats';

interface ContributeCTAProps {
  language: LanguageDisplay,
  stats: TaskStats,
}

const ContributeCTA = ({
  language,
  stats,
}: ContributeCTAProps) => {
  const url = `/${stats.taskMode.shortName}/${stats.taskCategory.shortName}?primary=${language.isoCode}&secondary=${stats.secondaryLang.isoCode}`;

  return (
    <Link href={url} passHref>
      <Button rounded outline>
        Contribute
      </Button>
    </Link>
  );
};

export default ContributeCTA;
