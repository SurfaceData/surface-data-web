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
    <Button rounded outline>
      <Link href={url}>
        <a>
          Contribute
        </a>
      </Link>
    </Button>
  );
};

export default ContributeCTA;
